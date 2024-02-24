import { JulieAppBar } from "./JulieAppBar";

export const Layout = ({ children }: any) => {
    return (
      <div>
        <JulieAppBar />
        <div style={{ marginTop: '160px' }}>
          {children}
        </div>
      </div>
    );
  };