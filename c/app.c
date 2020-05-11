#include "pmem.h";
#include "app.h";

app_App* app_app;

void app_create(unsigned int actorPoolSize) {
    app_app = pmem_alloc(sizeof(app_App));
    app_app->componentFirst = PMEM_NULL;
    app_app->componentLast = PMEM_NULL;
    app_app->actorFirst = PMEM_NULL;
    app_app->actorLast = PMEM_NULL;
    app_app->actorPoolSize = actorPoolSize;
    app_app->actorPool = pmem_alloc(sizeof(app_Actor) * actorPoolSize);
    app_app->actorPoolIndex = 0;
}

void app_start() {
    app_Component* component = app_app->componentFirst;
    while (component) {
        if (component->onComponentStart) {
            component->onComponentStart(component);
        }
        component = component->next;
    }
}

void app_registerComponent(app_Component* const component) {
    app_app->componentLast->next = component;
    component->next = PMEM_NULL;
    if (component->onComponentRegister) {
        component->onComponentRegister(component);
    }
}

void app_update() {
    app_Component* component = app_app->componentFirst;
    while (component) {
        if (component->onComponentUpdate) {
            component->onComponentUpdate(component);
        }
        component = component->next;
    }
}

app_Actor* app_actorCreate(
    app_Component** const components,
    void** const initDatas
) {
    app_Component* component;
    void* initData;
    app_Component** comps;
    void** datas;

    // Bail if any required pool is empty
    if (app_app->actorPoolIndex >= app_app->actorPoolSize) {
        return PMEM_NULL;
    }
    for (comps = components; comps; comps++) {
        if ((*comps)->segmentPoolIndex >= (*comps)->segmentPoolSize) {
            return PMEM_NULL;
        }
    }

    // Pull the next available actor out of the pool
    app_Actor* actor = app_app->actorPool + app_app->actorPoolIndex;
    app_app->actorPoolIndex++;
    
    // Append the actor to the end of the actor chain
    if (!app_app->actorFirst) {
        app_app->actorFirst = actor;
    }
    if (app_app->actorLast) {
        app_app->actorLast->next = actor;
    }
    actor->previous = app_app->actorLast;
    app_app->actorLast = actor;
    actor->next = PMEM_NULL;

    // Perform basic initialization on the actor
    actor->flags = APP_ACTOR_FLAG_ACTIVE;
    actor->segmentFirst = PMEM_NULL;
    actor->segmentLast = PMEM_NULL;

    // Perform component initialization on the actor
    for (
        datas = initDatas, comps = components;
        initData = *datas, component = *components;
        datas++, comps++
    ) {
        // Pull the next available segment out of the pool
        app_Segment* segment = (app_Segment*)(
            ((uintptr_t)component->segmentPool) +
            (component->segmentLength * component->segmentPoolIndex)
        );
        component->segmentPoolIndex++;

        // Append the segment to the end of the component segment chain
        if (!component->segmentFirst) {
            component->segmentFirst = segment;
        }
        if (component->segmentLast) {
            component->segmentLast->nextComponent = segment;
        }
        segment->previousComponent = component->segmentLast;
        component->segmentLast = segment;
        segment->nextComponent = PMEM_NULL;

        // Append the segment to the end of the actor segment chain
        if (!actor->segmentFirst) {
            actor->segmentFirst = segment;
        }
        if (actor->segmentLast) {
            actor->segmentLast->nextComponent = segment;
        }
        segment->previousActor = actor->segmentLast;
        actor->segmentLast = segment;
        segment->nextActor = PMEM_NULL;

        // Initialize the component-actor segment
        component->onActorCreate(segment, actor, component, initData);
    }
}