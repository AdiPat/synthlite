type OutputFormat = "json" | "csv";
export declare class AI {
    private static instance;
    private model;
    private constructor();
    static getInstance(): AI;
    getModel(): import("ai").LanguageModelV1;
}
export declare class GeneratedDataset {
    private data;
    constructor(data: any[]);
    saveToFile(outputPath: string, format: OutputFormat): Promise<void>;
}
export declare class SynthliteDataset {
    private jsonSchema;
    private schema;
    private emitter;
    constructor(jsonSchema: any);
    static fromSchemaFile(schemaPath: string): Promise<SynthliteDataset>;
    generate(count: number): Promise<GeneratedDataset>;
    private mutateDuplicates;
    private mutateDuplicateByKeys;
    private hasDuplicate;
    private getDuplicateRow;
}
/**
 *
 * SynthLite runner ⚡️
 *
 * */
export declare function synthlite(): Promise<void>;
export {};
