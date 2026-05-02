import { getTranslator } from "@/dictionaries/utils/getTranslator";
import useLocaleConfigStore from "@/stores/useLocaleConfigStore";

const useTranslator = () => {
  const lang = useLocaleConfigStore((state) => state.lang);

  const t = getTranslator(lang);

  return {
    t,
  };
};

export default useTranslator;
