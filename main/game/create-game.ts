import { Hardware, getAllWindows } from "keysender";

export default ({ name }: { name: string }) => {
  return getAllWindows().find(({ title }) => title == name);
};
