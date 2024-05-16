import { Button, ButtonProps } from './ui/button';
import { Loader } from 'lucide-react';
type CustomButtonProps = ButtonProps & {
  isLoading?: boolean;
};
export const CustomButton = (props: CustomButtonProps) => {
  return (
    <Button {...props} disabled={props.isLoading || props.disabled}>
      {props.isLoading && <Loader className="w-5 h-5 mr-2 animate-spin" />}
      {props.children}
    </Button>
  );
};
