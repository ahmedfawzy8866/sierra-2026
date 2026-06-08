export interface MemoryEntry {
    id: string;
    value: any;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}
export declare class ObedianMemory {
    private filePath;
    constructor(customPath?: string);
    private readStore;
    private writeStore;
    /**
     * Retrieves a memory entry by ID.
     */
    get(id: string): Promise<MemoryEntry | null>;
    /**
     * Sets or updates a memory entry.
     */
    set(id: string, value: any, tags?: string[]): Promise<MemoryEntry>;
    /**
     * Searches memories by query string and/or tags.
     */
    search(queryText: string, tags?: string[]): Promise<MemoryEntry[]>;
    /**
     * Deletes a memory entry by ID.
     */
    delete(id: string): Promise<boolean>;
    /**
     * Lists all memories in the store.
     */
    list(): Promise<MemoryEntry[]>;
    /**
     * Clears all memories.
     */
    clear(): Promise<void>;
}
export declare const obedian: ObedianMemory;
//# sourceMappingURL=index.d.ts.map