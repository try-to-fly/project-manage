import type { NextPage } from "next";
import { useState } from "react";

import { IgnoreList, Menu, ProjectList, ScanDir } from "@/components";

const Home: NextPage = () => {
  const [type, setType] = useState<string>("scan");
  return (
    <div className="flex">
      <Menu onChange={setType} />
      {type === "scan" && <ScanDir />}
      {type === "projects" && <ProjectList />}
      {type === "ignore" && <IgnoreList />}
    </div>
  );
};

export default Home;
