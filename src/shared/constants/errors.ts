export default {
  required: (attribute: string) => `The ${attribute} field is required.`,
  min: {
    string: (attribute: string, min: number) => `The ${attribute} must be at least ${min} ${min === 1 ? 'character' : 'characters'}.`,
    array: (attribute: string, min: number) => `The ${attribute} must have at least ${min} ${min === 1 ? 'item' : 'items'}.`,
  },
  max: {
    string: (attribute: string, max: number) => `The ${attribute} must be less than ${max} ${max === 1 ? 'character' : 'characters'}.`,
  },
  between: {
    numeric: (attribute: string, min: number, max: number) => `The ${attribute} must be between ${min} and ${max}.`,
    file: (attribute: string, min: number, max: number) => `The ${attribute} must be between ${min} and ${max} kilobytes.`,
    string: (attribute: string, min: number, max: number) => `The ${attribute} must be between ${min} and ${max} characters.`,
    array: (attribute: string, min: number, max: number) => `The ${attribute} must have between ${min} and ${max} items.`,
  },
  gt: {
    numeric: (attribute: string, value: number | string) => `The ${attribute} must be greater than ${value}.`,
    file: (attribute: string, value: number | string) => `The ${attribute} must be greater than ${value} kilobytes.`,
    string: (attribute: string, value: number | string) => `The ${attribute} must be greater than ${value} characters.`,
    array: (attribute: string, value: number | string) => `The ${attribute} must have more than ${value} items.`,
  },
  email: (attribute: string) => `The ${attribute} must be a valid email address.`,
  distinct: (attribute: string) => `The ${attribute} field has a duplicate value.`,
}
