import { Dispatch, SetStateAction } from 'react';
import { PageUIProps } from '@ui-pages/common-type';

export type LoginUIProps = PageUIProps & {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
};
