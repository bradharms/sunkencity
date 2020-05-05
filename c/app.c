#include <stdlib.h>;
#include <memory.h>;
#include "app.h";

app_App* app_create() {
    app_App* const app = malloc(sizeof(app_App));
    app->components = NULL;
    return app;
}

app_Component* app_findLastComponent(app_App* const app) {
    app_Component* component = app->components;
    while (component) {
        if (!component->next) {
            return component;
        }
        component = component->next;
    };
    return NULL;
}

void app_start(app_App* const app) {
    app_Component* component = app->components;
    while (component) {
        if (component->onStart) {
            component->onStart(component, app);
        }
        component = component->next;
    }
}

void app_registerComponent(app_App *const app, app_Component* const component) {
    app_Component* lastComponent = app_findLastComponent(app);
    lastComponent->next = component;
    component->next = NULL;
    if (component->onRegister) {
        component->onRegister(component, app);
    }
}

void app_update(app_App* const app) {
    app_Component* component = app->components;
    while (component) {
        if (component->onUpdate) {
            component->onUpdate(component, app);
        }
        component = component->next;
    }
}

app_Actor* app_actorCreate(
    app_App* const app,
    unsigned int componentCount,
    app_Component** const components,
    void** const initDatas
) {
    unsigned int i;
    size_t componentsLength = (sizeof(app_Component*) * componentCount);
    size_t size = sizeof(app_Actor) + componentsLength;
    for (i = 0; i < componentCount; i++) {
        size += components[i]->segmentLength;
    }
    app_Actor* actor = malloc(size);
    actor->flags = APP_ACTOR_FLAG_ACTIVE;
    actor->componentCount = componentCount;
    app_Component** actorComponents =
        (app_Component**)(((uintptr_t) actor) + (sizeof(app_Actor)));
    memcpy(actorComponents, components, componentsLength);
    void* segment = (void*)(((uintptr_t) actorComponents) + componentsLength);
    for (i = 0; i < componentCount; i++) {
        app_Component* component = components[i];
        if (component->onActorCreate) {
            component->onActorCreate(
                actor,
                segment,
                component,
                app,
                initDatas[i]
            );
        }
        segment = ((uintptr_t) segment) + component->segmentLength;
    }
}

app_Component** app_actorFindComponents(app_Actor* const actor) {
    
}
