export interface ICodeRegistry {
  payoutAddress(code: string): Promise<string>;
  codeURI(code: string): Promise<string>;
  isValidCode(code: string): Promise<boolean>;
  isRegistered(code: string): Promise<boolean>;
}

export class MockCodeRegistryClient implements ICodeRegistry {
  async payoutAddress(code: string): Promise<string> {
    return "0x1234567890123456789012345678901234567890";
  }
  async codeURI(code: string): Promise<string> {
    return \`https://api.base.dev/v1/agents/builder-codes/\${code}\`;
  }
  async isValidCode(code: string): Promise<boolean> {
    return code.length > 0;
  }
  async isRegistered(code: string): Promise<boolean> {
    return true;
  }
}
