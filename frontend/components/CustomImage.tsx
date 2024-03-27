import { CustomImageType } from "types/globalTypes";
import useDarkMode from "use-dark-mode";

const CustomImage = ({
  className,
  src,
  srcDark,
  srcSet,
  srcSetDark,
  alt,
}: CustomImageType) => {
  const darkMode = useDarkMode(false);

  return (
    <img
      className={className}
      srcSet={darkMode.value ? srcSetDark : srcSet}
      src={darkMode.value ? srcDark : src}
      alt={alt}
    />
  );
};

export default CustomImage;
