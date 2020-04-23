#include <stdlib.h>;

#include "app.h";
// #include "components/factory.h";
// #include "components/input.h";
// #include "components/update.h";
// #inclide "components/render.h";

int main (void) {
    app_AppData *const appData = app_create(5);
    // app_registerEngine(factory_engine);
    // app_registerEngine(input_engine);
    // app_registerEngine(update_engine);
    // app_registerEngine(render_engine);

    app_start(appData);
}
