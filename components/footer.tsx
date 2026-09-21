import { COMPANY_NAME } from "@/lib/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="p-5 flex-center">
        {currentYear}
        <span className="ml-2">{COMPANY_NAME} All Rights Reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
