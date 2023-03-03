import { YoutubeContext } from "context/youtube";
import { useNonNullableContext } from "./useNonNullableContext";

export const useYoutubeContext = () => useNonNullableContext(YoutubeContext);
