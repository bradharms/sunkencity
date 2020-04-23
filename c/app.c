#include <stdlib.h>;
#include "app.h";

app_AppData* app_create(unsigned int engineCountMax) {
    app_AppData* const appData = malloc(sizeof(app_AppData));
    appData->engines = malloc(sizeof(app_Engine*) * engineCountMax);
    appData->enginesCount = 0;
    return appData;
}

void app_start(app_AppData* const appData) {
    for (unsigned int i = 0; i < appData->enginesCount; i++) {
        appData->engines[i]->onStart(appData);
    }
}

void app_registerEngine(app_AppData *const appData, app_Engine* const engine) {
    appData->engines[appData->enginesCount] = engine;
    appData->enginesCount ++;
    if (engine->onRegister) {
        engine->onRegister(appData);
    }
}
