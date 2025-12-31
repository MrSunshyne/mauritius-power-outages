import { useDateFormat } from "@vueuse/core";

export function formatDate(date: Date | string) {
  const formatted = useDateFormat(date, "DD MMMM YYYY");
  return formatted.value;
}
