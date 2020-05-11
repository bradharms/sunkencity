#include "pmem.h";

pmem_index_t pmem_allocations[PMEM_CLUSTER_COUNT];
pmem_cluster_t pmem_clusters[PMEM_CLUSTER_COUNT];

void pmem_init() {
    for (pmem_index_t cIndex = 0; cIndex < PMEM_CLUSTER_COUNT; cIndex++) {
        pmem_allocations[cIndex] = 0;
    }
}

pmem_cluster_t* pmem_alloc(const pmem_size_t byteCount) {
    // Determine the number of clusters we need based on the byte count
    const pmem_index_t cCount =
        // This is integer division. The output is rounded down.
        (byteCount / PMEM_CLUSTER_SIZE) +
        // If the modulus is non-zero, we need one extra cluster.
        (byteCount % PMEM_CLUSTER_SIZE ? 1 : 0);
    // If the required cluster count is 0 or is larger than the total number of
    // clusters available, we can't allocate anything.
    if (cCount == 0 || cCount >= PMEM_CLUSTER_SIZE) {
        return PMEM_NULL;
    }
    // Search for a fragment of the required length
    pmem_index_t fIndex = 0;
    pmem_index_t cIndex = 0;
    pmem_index_t fLength = 0;
    pmem_index_t uLength = 0;
    // Keep scanning until we reach the end of the cluster pool
    while (cIndex < PMEM_CLUSTER_COUNT) {
        // Check for an allocation
        fLength = pmem_allocations[cIndex];
        // If there is an allocation, skip past it
        if (fLength != 0) {
            cIndex = fIndex = fIndex + fLength;
            uLength = 0;
            continue;
        }
        // There is at least one more unallocated cluster available in this
        // unallocated region.
        uLength++;
        // We have found the required number of clusters.
        // Write the fragment length into the allocation map to allocate a
        // new fragment, then return the first cluster in the fragment.
        if (uLength == cCount) {
            pmem_allocations[fIndex] = uLength;
            return pmem_clusters + fIndex;
        }
        cIndex++;
    }
    // No contiguous region was found to be long enough for the request.
    return PMEM_NULL;
}

void pmem_free(pmem_cluster_t* const cluster) {
    pmem_allocations[cluster - pmem_clusters] = 0;
}
