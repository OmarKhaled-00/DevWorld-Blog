import ServicesCard from "../ServicesCard/ServicesCard";
import ServicesData from "../../Constants/ServicesData/ServicesData";
function WPage_Services() {
  return (
    <div className="container m-auto flex flex-wrap justify-center gap-2 p-1">
      {ServicesData.map((service, index) => (
        <ServicesCard
          key={index}
          mainTitle={service.title}
          icon={service.icon}
        />
      ))}
    </div>
  );
}

export default WPage_Services;
