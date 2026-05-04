export type Schema2Data = {
  a?: string;
  w?: string;
  s?: string[];
  r?: {
    a?: { c: string; a: string };
    w?: { c: string; a: string };
  };
  m?: Record<string, unknown>;
};

export interface ERC8021Config {
  code: string;
  schema?: 0 | 1 | 2;
  additionalCodes?: string[];
  schema2Data?: Schema2Data;
  registryChainId?: number;
  registryAddress?: string;
}
