import { Button, ButtonProps } from './ui/button';
import { Loader } from 'lucide-react';
type CustomButtonProps = ButtonProps & {
  loading?: boolean;
};
export const CustomButton = (props: CustomButtonProps) => {
  return (
    <Button {...props} disabled={props.loading || props.disabled}>
      {props.loading && <Loader className="w-5 h-5 mr-2 animate-spin" />}
      {props.size != 'icon' ? props.children : !props.loading && props.children}
    </Button>
  );
};
