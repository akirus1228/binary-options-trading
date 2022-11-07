import { EarnPool } from "./components/earn-pool";
import { About } from "./components/about";

const Pools = (): JSX.Element => {
  return (
    <div className="grow grid xs:grid-rows-2 xs:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 bg-heavybunker lg:px-5 xl:px-60 lg:py-30 xl:py-55 xs:gap-40 xl:gap-80">
      <EarnPool />
      <About />
    </div>
  );
};

export default Pools;
