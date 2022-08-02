export class UtilsService {
    public static toDto<T, E>(
      model: new (entity: E, options?: any) => T,
      entity: E,
      options?: any,
    ): T {
      return new model(entity, options);
    }  
    
  }