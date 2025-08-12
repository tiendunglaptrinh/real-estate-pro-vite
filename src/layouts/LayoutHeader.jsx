import {Header, Footer} from "@components/component"
function LayoutHeader({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default LayoutHeader;
