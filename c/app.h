#ifndef APP_H
#define APP_H

typedef struct app_AppData_t {
    app_Engine** engines;
    unsigned int enginesCount;
} app_AppData;

typedef struct app_Engine_t {
    void (* const onRegister)(app_AppData* const appData);
    void (* const onStart)(app_AppData* const appData);
} app_Engine;

app_AppData* app_create(app_AppData* const appData);
void app_start(app_AppData* const appData);


#endif // APP_H
