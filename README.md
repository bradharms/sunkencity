# Sunken City

An example game engine written in pure JavaScript using modern ECMA features as well as intentionally older coding paradigms.

## Intentional Limitations

As a programming exercise, I intentionally placed certain hard limits on the kinds of techniques I was allowed to use in this project. The goal is to make the the code highly compatible with those techniques that are required for the C programming language (not C++) and not to depend on any third-party frameworks. In particular, the following restrictions were applied:

### No Classes or Instances

Modern JavaScript fully supports classes, but C does not. Instead, you have to come up with another way to achieve the goals of polymorphism, encapsulation, inheritence, etc.
Typically, this is achieved through the use of a common symbolic type identifier property within a series of data structures. These type IDs are used to look up a callback table associated with the type ID. Within the table, each callback knows the structure associated with the type ID.

### Restrict Object Creation to the Bare Minimum

In my normal programming patterns, I typically follow a highly functional-oriented archictecture, where many objects are created to replace other objects instead of updating their properties. This creates and destroys a lot of objects, which is fine for JavaScript, but very messy to do within a C program. Instead, I deliberately reused as many objects as I could.

### No Precompilers

I usually write my code in TypeScript, but for this project I wanted to stay as close to the metal as possible. Every language feature used is natively supported by modern Chromium-based browsers and no extra transpilers are needed.

### Code As If Strongly-Typed

Even though TypeScript is not technically required to compile or run the code, I still code as if everything is strongly typed, and I use Visual Studio Code's built-in TypeScript-based type checker to ensure that everything is being used according to its interfaces. To enforce this, I make extensive use of JSDocs, which TypeScript recognizes as valid type information. 

## Application Structure
 
The game is controlled by a series of sub-engines (usually just called "engines") that are conceptually organized within a container called the "app." Each engine is responsible for handling a specific aspect of runtime logic, and the app's only job is to coordinate them.

### Application Phases

When the app is constructed, each engine is initialized sequentially as part of the "registration" phase, and then each engine is started as part of the "start" phase.

#### App Creation Phase

The app is initalized with a call to `app.create()`, which allocates and returns general-purpose data structure that the app's engines will store their data in. It then registers each of the passed engines. The engines are each passed as a callback table, with callbacks within the table corresponding to different phases of execution.

#### Registration Phase

The registration phase, which is identified by the `handleRegisterEngine()` callback, is responsible for allocating the memory and loading the data used by an engine throughout its lifetime. This is primarily singleton data; it is not re-allocated or de-allocated during the life of the program.

#### Start Phase

This phase will not start until it is explicitly told to. It is responsible for registering any and all hooks needed to get each engine to start doing its runtime job. This includes, for example, installing keyboard event handlers and intervals. The start phase should not be executed until all registration tasks are completed.

#### Run Phase

This refers to all time following the end of the start phase.

### Engines

These are the engines that control execution:

#### Factory Engine

The factory engine is responsible for the creation and destruction of managers and actors. It allocates the data stores for managers and actors, registers managers to their respective type IDs, and runs hooks related to the creation destruction of managers and actors.

#### Input Engine

The input engine is responsible for gathering input from the user and presenting it in via an abstracted data-based API.

#### Render Engine

The render engine is responsible for drawing managers and actors to the screen per each game cycle.

#### Update Engine

The update engine is responsible for performing manager- and actor-specific logic per each game cycle.

### Managers and Actors

On-screen and interactive elements of the game are implmented through the use of "managers" and "actors".

For every type of actor, there is exactly one manager, regardless of how many instances of the type of actor there are (even zero). All actors of a particular type will use the manager as a location for shared data, as well as for any behavior that applies to all actors of the given type collectively.

#### Manager and Actor Registration

Similar to engines, managers must be registered. This is done through the "factory" engine via the `factory.registerManager()` function. Doing this generates a new type ID, which is used to create actors later.

#### Manager Handlers

Registering a manager tells the app about a series of special functions that are related to the actor type that the manager manages. These functions are called "handlers," and they will be called automatically by the app at specific points during the execution of the game.

There are a variety of different handlers, and each one is used by a specific engine. Not all handlers have to be defined for a given manager; they are optional.

##### handleRegisterManager()

Used by the factory engine. This is called as soon as a new manager is registerd. It's job is to allocate and load memory for all actors managed by the manager.

##### handleStartManager()

Used by the factory engine. This is called as part of the factory engine's own start phase. It's purpose is to give each manager a chance to start any ongoing task that the manager may need in regards to actors of its type. It will be called once for each registered manager in the order they were registered.

##### handleCreateActor()

Used by the factory engine. This is called whenever an actor is created. It's job is to initialize an actor's instance-specific data.

##### handleDestroyActor()

Used by the factory engine. This is called whenever an actor is destroyed. It's job is to clean up an actor's instance-specific data.

##### handleUpdateBeforeActors()

Used by the update engine. This is called once for each registerd manager, prior to any individual actors being updated.

##### handleUpdateAfterActors()

Used by the update engine. This is called once for each registered manager, following all updates to individual actors being updated.

##### handleUpdateActor()

Used by the update engine. This is called once per actor, per game cycle. It's job is to perform an actor's instance-specific game logic.

##### handleRenderBeforeActors()

Used by the render engine. This is called once for each registerd manager prior to rendering any specific actor instances. It's job is to perform rendering of things not specific to any one actor.

##### handleRenderAfterActors()

Used by the render engine. This is called once for each registered manager following the rendering of all specific actors.

##### handleRenderActor()

Used by the render engine. This is called once per actor, per game cycle. It's job is to draw each actor onto the screen.