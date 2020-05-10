#include "pmem.h"
#include "app.h"

int main (void) {
    pmem_init();
    app_create(32);

    app_start();
}
