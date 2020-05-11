#ifndef APP_H
#define APP_H

#include <stdlib.h>
#include <stdbool.h>

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
    struct app_Component_t* componentFirst;
    /**
     * Last component in the component chain
     */
    struct app_Component_t* componentLast;
    /**
     * First actor in the actor chain
     */
    struct app_Actor_t* actorFirst;
    /**
     * Last actor in the actor chain
     */
    struct app_Actor_t* actorLast;
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
    struct app_Actor_t* actorPool;
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
    struct app_Component_t* next;
    /**
     * First segment in the component's segment chain
     */
    struct app_Segment_t* segmentFirst;
    /**
     * Last segment in the component's segment chain
     */
    struct app_Segment_t* segmentLast;
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
        struct app_Component_t* const component
    );
    /**
     * Fired when the app starts
     */
    void (* const onComponentStart)(
        /** Component that is being started */
        struct app_Component_t* const component
    );
    /**
     * Fired once per game loop
     */
    void (* const onComponentUpdate)(
        /** Component being updated */
        struct app_Component_t* const component
    );
    /**
     * Fired when an actor with a given component is created
     */
    void (* const onActorCreate)(
        /** Segment of the actor for this component */
        struct app_Segment_t* const segment,
        /** Actor being added */
        struct app_Actor_t* const actor,
        /** Component to which the actor is being added */
        struct app_Component_t* const component,
        /** Initialization data specific to this component */
        void* const initData
    );
    /**
     * Fired when an actor is removed from a component
     */
    void (* const onActorRemove)(
        /** Segment being removed */
        struct app_Segment_t* const segment,
        /** Actor being removed */
        struct app_Actor_t* const actor,
        /** Component from which the actor is being removed */
        struct app_Component_t* const component
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
    struct app_Segment_t* segmentFirst;
    /**
     * Last segment in the chain of segments for this actor
     */
    struct app_Segment_t* segmentLast;
    /**
     * Next actor in the chain of actors for the app or actor pool
     */
    struct app_Actor_t* next;
    /**
     * Previous actor in the chain of actors for the app or actor pool
     */
    struct app_Actor_t* previous;
} app_Actor;

/**
 * Data pertaining to a specific actor for a specific component
 */
typedef struct app_Segment_t {
    /**
     * Actor for this segment
     */
    struct app_Actor_t* actor;
    /**
     * Component for this segment
     */
    struct app_Component_t* component;
    /**
     * Next segment for the segment's component
     */
    struct app_Segment_t* nextComponent;
    /**
     * Previous segment for the segment's component
     */
    struct app_Segment_t* previousComponent;
    /**
     * Next segment for the segment's actor
     */
    struct app_Segment_t* nextActor;
    /**
     * Previous segment for the segment's actor
     */
    struct app_Segment_t* previousActor;
} app_Segment;

/**
 * Create a new app
 */
void app_create(
    /** Number of actors to allocate in the actor pool */
    unsigned int actorCount
);

/**
 * Register a component to the app
 **/
void app_registerComponent(struct app_Component_t* const component);

/**
 * Begin the app's main game loop
 */
void app_start();

/**
 * Run an app update cycle
 */
void app_update();

/**
 * Create a new actor
 * 
 * @return The actor, or NULL on failure
 */
struct app_Actor_t* app_actorCreate(
    /** Null-terminated array of pointers to components this actor will use */
    struct app_Component_t** const components,
    /** Array of initialization data for each component */
    void** const initDatas
);

/**
 * Destroy an actor
 * @return Whether or not destruction was successful
 */
bool app_actorDestroy(
    /** Actor to be destroyed */
    struct app_Actor_t* const actor
);

/**
 * Find the segment matching the given actor and component
 * @return A pointer to the segment
 */
struct app_Segment_t* app_actorFindSegment(
    /** Component whose segment will be returned */
    struct app_Component_t* const component
);

#endif // APP_H
