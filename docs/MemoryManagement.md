# Memory Management

## Private Heap Manager

We can create a specialized heap manager as follows.

> **NOTE:** This technique and code is theoretical and has not yet been tested. 

### Initializing the Heap

1.) Define a cluster size (number of bytes per cluster):
```c
#define PHEAP_CLUSTER_SIZE 64;
```

2.) Define the number of clusters in the heap:
```c
#define PHEAP_CLUSTER_COUNT 255;
```

3.) Define a type for one byte in a cluster:
```c
typedef unsigned char pheap_byte_t;
```

4.) Define a type for a cluster
```c
typedef pheap_byte_t[PHEAP_CLUSTER_SIZE] pheap_cluster_t;
```

5.) Define a type for an index to a cluster
```c
typedef pheap_index_t unsigned char;
```

3.) Define a size type
```c
typedef pheap_size_t unsigned int;
```

6.) Create a cluster allocation map:
```c
pheap_index_t pheap_allocations[HEAP_CLUSTER_COUNT];
```

7.) Initialize the allocation map:
```c
for (pheap_index_t cIndex = 0; cIndex < PHEAP_CLUSTER_COUNT; cIndex++) {
    pheap_allocations[i] = 0;
}
```

8.) Allocate another array to contain all the heap's clusters:
```c
pheap_cluster_t pheap_clusters[PHEAP_CLUSTER_COUNT];
```

### Allocation Requests

The heap is now initialized and we are ready to begin handling requests for allocations. We need to define functions that can do this.

Allocations and deallocations are generally random. There is no reliable way to determine any relationship between the order in which fragments are allocated and the order in which they are deallocated. Therefore, the only optimizations we will make will be based on where we know allocated fragments to be located within the heap and not the order of allocation.

What follows is an allocator function that simply scans the allocation map from the beginning to find a sequence of clusters equal to the number requested, then marks the location of the beginning of the equence so that future allocations will know how far to skip past it.

```c
pheap_cluster_t* pheap_alloc(const pheap_size_t byteCount) {
    // Determine the number of clusters we need based on the byte count
    const pheap_index_t cCount =
        // This is integer division. The output is rounded down.
        (byteCount / PHEAP_CLUSTER_SIZE) +
        // If the modulus is non-zero, we need one extra cluster.
        (byteCount % PHEAP_CLUSTER_SIZE ? 1 : 0);
    // If the required cluster count is 0 or is larger than the total number of
    // clusters available, we can't allocate anything.
    if (cCount == 0 || cCount >= PHEAP_CLUSTER_SIZE) {
        return NULL;
    }
    // Search for a fragment of the required length
    pheap_index_t fIndex = 0;
    pheap_index_t cIndex = 0;
    pheap_index_t fLength = 0;
    pheap_index_t uLength = 0;
    // Keep scanning until we reach the end of the cluster pool
    while (cIndex < PHEAP_CLUSTER_COUNT) {
        // Check for an allocation
        fLength = pheap_allocations[cIndex];
        // If there is an allocation, skip past it
        if (fLength != 0) {
            cIndex = fIndex = fIndex + fLength;
            uLength = 0;
            continue;
        }
        // There is at least one more unallocated cluster available in this
        // unallocated reagion.
        uLength++;
        // We have found the required number of clusters.
        // Write the fragment length into the allocation map to allocate a
        // new fragment, then return the first cluster in the fragment.
        if (uLength == cCount) {
            pheap_allocations[fIndex] = uLength;
            return pheap_clusters + fIndex;
        }
        cIndex++;
    }
    // No contiguous region was found to be long enough for the request.
    return NULL;
}
```

### Deallocation Requests

Deallocating a fragment simply means marking the first cluster in the allocation map as having a fragment length of 0.

```c
void pheap_free(pheap_cluster_t* const cluster) {
    pheap_allocations[cluster - pheap_cluster] = 0;
}
```