#include <stdlib.h>;
#include <memory.h>;
#include "app.h";

app_App* app_create(unsigned int actorPoolSize) {
    app_App* const app = malloc((size_t) sizeof(app_App));
    app->componentFirst = NULL;
    app->componentLast = NULL;
    app->actorFirst = NULL;
    app->actorLast = NULL;
    app->actorPoolSize = actorPoolSize;
    app->actorPool = malloc(((size_t) sizeof(app_Actor)) * actorPoolSize);
    app->actorPoolIndex = 0;
    return app;
}

void app_start(app_App* const app) {
    app_Component* component = app->componentFirst;
    while (component) {
        if (component->onComponentStart) {
            component->onComponentStart(component, app);
        }
        component = component->next;
    }
}

void app_registerComponent(app_App *const app, app_Component* const component) {
    app->componentLast->next = component;
    component->next = NULL;
    if (component->onComponentRegister) {
        component->onComponentRegister(component, app);
    }
}

void app_update(app_App* const app) {
    app_Component* component = app->componentFirst;
    while (component) {
        if (component->onComponentUpdate) {
            component->onComponentUpdate(component, app);
        }
        component = component->next;
    }
}

app_Actor* app_actorCreate(
    app_App* const app,
    app_Component** const components,
    void** const initDatas
) {
    app_Component* component;
    void* initData;
    app_Component** comps;
    void** datas;

    // Bail if any required pool is empty
    if (app->actorPoolIndex >= app->actorPoolSize) {
        return NULL;
    }
    for (comps = components; comps; comps++) {
        if ((*comps)->segmentPoolIndex >= (*comps)->segmentPoolSize) {
            return NULL;
        }
    }

    // Pull the next available actor out of the pool
    app_Actor* actor = app->actorPool + app->actorPoolIndex;
    app->actorPoolIndex++;
    
    // Append the actor to the end of the actor chain
    if (!app->actorFirst) {
        app->actorFirst = actor;
    }
    if (app->actorLast) {
        app->actorLast->next = actor;
    }
    actor->previous = app->actorLast;
    app->actorLast = actor;
    actor->next = NULL;

    // Perform basic initialization on the actor
    actor->flags = APP_ACTOR_FLAG_ACTIVE;
    actor->segmentFirst = NULL;
    actor->segmentLast = NULL;

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
        segment->nextComponent = NULL;

        // Append the segment to the end of the actor segment chain
        if (!actor->segmentFirst) {
            actor->segmentFirst = segment;
        }
        if (actor->segmentLast) {
            actor->segmentLast->nextComponent = segment;
        }
        segment->previousActor = actor->segmentLast;
        actor->segmentLast = segment;
        segment->nextActor = NULL;

        // Initialize the component-actor segment
        component->onActorCreate(segment, actor, component, app, initData);
    }
}