/**
 * Private Memory Manager
 */
#ifndef PMEM_H
#define PMEM_H

/**
 * Number of bytes in a cluster
 */
#define PMEM_CLUSTER_SIZE 64

/**
 * Number of clusters available
 */
#define PMEM_CLUSTER_COUNT 255

/**
 * Pmem-typed null
 */
#define PMEM_NULL (void*) 0

/**
 * Type of a single byte
 */
typedef unsigned char pmem_byte_t;

/**
 * Type of a cluster
 */
typedef struct { pmem_byte_t b[PMEM_CLUSTER_SIZE]; } pmem_cluster_t;

/**
 * Type of an index to a cluster
 */
typedef unsigned char pmem_index_t;

/**
 * Type of a size in bytes
 */
typedef unsigned int pmem_size_t;

/**
 * Initialize the heap
 */
void pmem_init();

/**
 * Allocate a number of clusters required for the given number of bytes.
 * 
 * Allocations and deallocations are generally random. There is no reliable way
 * to determine any relationship between the order in which fragments are
 * allocated and the order in which they are deallocated. Therefore, the only
 * optimizations we will make will be based on where we know allocated fragments
 * to be located within the heap and not the order of allocation.
 * 
 * This function simply scans the allocation map from the beginning to find a
 * sequence of clusters equal to the number requested, then marks the location
 * of the beginning of the sequence so that future allocations will know how far
 * to skip past it.
 */
void* pmem_alloc(const pmem_size_t byteCount);

/**
 * Deallocates a fragment.
 * 
 * Deallocating a fragment simply means marking the first cluster in the
 * allocation map as having a fragment length of 0.
 */
void pmem_free(void* const cluster);

#endif // PMEM_H
