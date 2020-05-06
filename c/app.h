#ifndef APP_H
#define APP_H

#include <stdbool.h>;

/**
 * Bit of the actor flag indicating whether the actor is active
 */
#define APP_ACTOR_FLAG_ACTIVE 0

/**
 * Top-level data store for the application
 */
typedef struct app_App_t {
    /**
     * First component in the component chain
     */ 
    app_Component* componentFirst;
    /**
     * Last component in the component chain
     */
    app_Component* componentLast;
    /**
     * First actor in the actor chain
     */
    app_Actor* actorFirst;
    /**
     * Last actor in the actor chain
     */
    app_Actor* actorLast;
    /**
     * Number of actors available in the actor pool
     */
    unsigned int actorPoolSize;
    /**
     * Index of the next available actor from the pool
     */
    unsigned int actorPoolIndex;
    /**
     * Pool of available actors
     */
    app_Actor* actorPool;
} app_App;

/**
 * Data for a specific application actor behavior
 */
typedef struct app_Component_t {
    /**
     * Number of bytes consumed by a segment of this component
     */
    size_t segmentLength;
    /**
     * Next component in the chain of components for the app
     */
    app_Component* next;
    /**
     * First segment in the component's segment chain
     */
    app_Segment* segmentFirst;
    /**
     * Last segment in the component's segment chain
     */
    app_Segment* segmentLast;
    /**
     * Number of segments in the pool
     */
    unsigned int segmentPoolSize;
    /**
     * Index of the next segment to be pulled from the pool
     */
    unsigned int segmentPoolIndex;
    /**
     * Pointer to the beginning of the segment pool
     */
    void* segmentPool;
    /**
     * Fired when the component is added to the app
     */
    void (* const onComponentRegister)(
        /** Component being registered */
        app_Component* const component,
        /** App to which the component is being registered */
        app_App* const app
    );
    /**
     * Fired when the app starts
     */
    void (* const onComponentStart)(
        /** Component that is being started */
        app_Component* const component,
        /** App that is being started */
        app_App* const app
    );
    /**
     * Fired once per game loop
     */
    void (* const onComponentUpdate)(
        /** Component being updated */
        app_Component* const component,
        /** App being updated */
        app_App* const app
    );
    /**
     * Fired when an actor with a given component is created
     */
    void (* const onActorCreate)(
        /** Segment of the actor for this component */
        app_Segment* const segment,
        /** Actor being added */
        app_Actor* const actor,
        /** Component to which the actor is being added */
        app_Component* const component,
        /** App containing the component being added */
        app_App* const app,
        /** Initialization data specific to this component */
        void* const initData
    );
    /**
     * Fired when an actor is removed from a component
     */
    void (* const onActorRemove)(
        /** Segment being removed */
        app_Segment* const segment,
        /** Actor being removed */
        app_Actor* const actor,
        /** Component from which the actor is being removed */
        app_Component* const component,
        /** App containing the component from which the actor is being removed*/
        app_App* const app
    );
} app_Component;

/**
 * Instance of a specific actor within the app
 */
typedef struct app_Actor_t {
    /**
     * Flags corresponding to various actor states
     * 
     * See the APP_ACTOR_FLAG_* macros for refernce to bit assignments.
     */
    unsigned int flags;
    /**
     * First segment in the chain of segments for this actor
     */
    app_Segment* segmentFirst;
    /**
     * Last segment in the chain of segments for this actor
     */
    app_Segment* segmentLast;
    /**
     * Next actor in the chain of actors for the app or actor pool
     */
    app_Actor* next;
    /**
     * Previous actor in the chain of actors for the app or actor pool
     */
    app_Actor* previous;
} app_Actor;

/**
 * Data pertaining to a specific actor for a specific component
 */
typedef struct app_Segment_t {
    /**
     * Actor for this segment
     */
    app_Actor* actor;
    /**
     * Component for this segment
     */
    app_Component* component;
    /**
     * Next segment for the segment's component
     */
    app_Segment* nextComponent;
    /**
     * Previous segment for the segment's component
     */
    app_Segment* previousComponent;
    /**
     * Next segment for the segment's actor
     */
    app_Segment* nextActor;
    /**
     * Previous segment for the segment's actor
     */
    app_Segment* previousActor;
} app_Segment;

/**
 * Create a new app
 */
app_App* app_create(
    /** Number of actors to allocate in the actor pool */
    unsigned int actorCount
);

/**
 * Register a component to the app
 **/
void app_registerComponent(app_App* const app, app_Component* const component);

/**
 * Begin the app's main game loop
 */
void app_start(app_App* const app);

/**
 * Run an app update cycle
 */
void app_update(app_Component* app);

/**
 * Create a new actor
 * 
 * @return The actor, or NULL on failure
 */
app_Actor* app_actorCreate(
    /** App to which the actor will be added */ 
    app_App* const app,
    /** Null-terminated array of pointers to components this actor will use */
    app_Component** const components,
    /** Array of initialization data for each component */
    void** const initDatas
);

/**
 * Destroy an actor
 * @return Whether or not destruction was successful
 */
bool app_actorDestroy(
    /** App inside of which the actor will be destroyed */
    app_App* const app,
    /** Actor to be destroyed */
    app_Actor* const actor
);

/**
 * Find the segment matching the given actor and component
 * @return A pointer to the segment
 */
app_Segment* app_actorFindSegment(
    /** Actor whose segment will be returned */
    app_Actor* const actor,
    /** Component whose segment will be returned */
    app_Component* const component
);

#endif // APP_H
