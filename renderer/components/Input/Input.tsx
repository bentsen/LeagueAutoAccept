import { Combobox, Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import React from "react";

export type ILeague = {
  key: string;
  name: string;
  image: string;
};

export const Input = ({
  content,
  label,
  selected,
  setSelected,
}: {
  content: ILeague[];
  label?: string;
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [search, setSearch] = React.useState<string>("");

  const filteredContent = !search
    ? content
    : content?.filter((c) =>
        c.name.toLowerCase().startsWith(search.toLowerCase())
      );

  return (
    <Combobox value={selected} onChange={setSelected}>
      {label && <label className="text-white text-lg">{label}</label>}
      <Combobox.Input
        className={"h-10 rounded-md w-full indent-2"}
        onChange={(event) => setSearch(event.target.value)}
        displayValue={(e) => (e[1] == 0 ? "" : e[0])}
      />
      <div className="w-full relative">
        <Combobox.Options
          className={"absolute z-90 max-h-40 w-full overflow-auto bg-white"}
        >
          {filteredContent.map((c) => (
            <Combobox.Option key={c.key} value={[c.name, c.key]}>
              {({ active, selected }) => (
                <div
                  className={`flex flex-row py-1 items-center pl-2 gap-2 cursor-pointer ${
                    active ? "bg-gray-200" : "bg-white"
                  }`}
                >
                  <Image src={c.image} width={30} height={30} />
                  {c.name}
                </div>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};

export default Input;
