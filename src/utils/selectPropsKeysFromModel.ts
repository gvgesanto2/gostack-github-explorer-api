import { Repository } from 'typeorm';

const selectPropsKeysFromModel = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  modelRepository: Repository<object>,
  propsKeysToExclude: string[],
): string[] => {
  const modelKeys = Object.keys(modelRepository.metadata.propertiesMap);

  return modelKeys.filter(modelKey => !propsKeysToExclude.includes(modelKey));
};

export default selectPropsKeysFromModel;
