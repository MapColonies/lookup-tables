interface ILookupOption {
  value: string; 
  translationCode: string;
  properties?: Record<string, unknown>;
};

export default ILookupOption;
