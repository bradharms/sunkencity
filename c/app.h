#ifndef APP_H
#define APP_H

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
    app_Component* components;
} app_App;

/**
 * Data store for a specific application actor behavior
 */
typedef struct app_Component_t {
    /**
     * Number of bytes consumed by this component's actor segment
     */
    unsigned int segmentLength;
    /**
     * Fired when the component is added to the app
     */
    void (* const onRegister)(
        /** Component being registered */
        app_Component* const component,
        /** App to which the component is being registered */
        app_App* const app
    );
    /**
     * Fired when the app starts
     */
    void (* const onStart)(
        /** Component that is being started */
        app_Component* const component,
        /** App that is being started */
        app_App* const app
    );
    /**
     * Fired once per game loop
     */
    void (* const onUpdate)(
        /** Component being updated */
        app_Component* const component,
        /** App being updated */
        app_App* const app
    );
    /**
     * Fired when an actor with a given component is created
     */
    void (* const onActorCreate)(
        /** Actor being added */
        app_Actor* const actor,
        /** Segment of the actor for this component */
        void* segment,
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
        /** Actor being removed */
        app_Actor* const actor,
        /** Component from which the actor is being removed */
        app_Component* const component,
        /** App containing the component from which the actor is being removed*/
        app_App* const app
    );
    /**
     * Pointer to the next component in the app, or NULL if this is the last one
     * 
     * This will be assigned by the app when the next component is registered
     */
    struct app_Component_t* next;
} app_Component;

/**
 * Instance of a specific actor within the app
 * 
 * This struct only has the data that is common for all actors. Following an
 * actor struct instance in memory is a variable-length array of pointers to
 * the components this actor uses, which is then followed by the segment data
 * for those components. The length of each segment is indicated within the
 * data for each corresponding component.
 */
typedef struct app_Actor_t {
    /**
     * Flags corresponding to various actor traits
     * 
     * See the APP_ACTOR_FLAG_* macros for refernce to bit assignments.
     */
    unsigned int flags;
    /**
     * Number of components used by this actor
     */
    unsigned int componentCount;
} app_Actor;

/**
 * Create a new app
 */
app_App* app_create();

/**
 * Begin the app's main game loop
 */
void app_start(app_App* const app);

/**
 * Register a component to the app
 **/
void app_registerComponent(app_App* const app, app_Component* const component);

/**
 * Return the last component in the app
 */
app_Component* app_findLastComponent(app_App* const app);

/**
 * Run an app update cycle
 */
void app_update(app_Component* app);

/**
 * Create a new actor
 * 
 * Returns NULL if no actor could be created
 */
app_Actor* app_actorCreate(
    /** App to which the actor will be added */ 
    app_App* const app,
    /** Number of components this actor will have */
    unsigned int componentCount,
    /** Array of pointers to components this actor will use */
    app_Component** const components,
    /** Array of initialization data for each component */
    void** const initDatas
);

/**
 * Destroy an actor
 */
void app_actorDestroy(
    /** App inside of which the actor will be destroyed */
    app_App* const app,
    /** Actor to be destroyed */
    app_Actor* const actor
);

/**
 * Return a pointer to an actor's component pointer array
 */
app_Component** app_actorFindComponents(app_Actor* const actor);

/**
 * Return a pointer to the actor segment for the given actor and component
 */
void* app_actorFindSegment(
    /** Actor whose segment will be returned */
    app_Actor* const actor,
    /** Component whose segment will be returned */
    app_Component* const component
);

#endif // APP_H
