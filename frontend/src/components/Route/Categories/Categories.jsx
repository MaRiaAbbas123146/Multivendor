import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    if (typeof image === "object" && image.url) {
      return image.url;
    }
    if (typeof image === "string" && image.startsWith("http")) {
      return image;
    }
    return image;
  };

  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div className="branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md">
          {brandingData &&
            brandingData.map((i, index) => {
              const Icon = i.icon;

              return (
                <div className="flex items-start" key={i.id || index}>
                  <div className="icon">
                    <Icon size={30} />
                  </div>

                  <div className="px-3">
                    <h3 className="font-bold text-sm md:text-base">
                      {i.title}
                    </h3>
                    <p className="text-xs md:text-sm">
                      {i.Description}
                    </p>
                  </div>
                </div>
              );
            })}

        </div>
      </div>

      <div
        id="categories"
        className={`${styles.section} bg-white p-6 rounded-lg mb-12`}
      >
        <div className="grid grid-cols-1 gap-1.25 md:grid-cols-2 md:gap-2.5 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5 xl:gap-7.5">
          {categoriesData &&
            categoriesData.map((i) => {
              const handleSubmit = () => {
                navigate(`/products?category=${i.title}`);
              };


              const categoryImage = i.image_Url;

              return (
                <div
                  className="w-full h-25 flex items-center justify-between cursor-pointer overflow-hidden"
                  key={i.id}
                  onClick={handleSubmit}
                >
                  <h5 className="text-[18px] leading-[1.3]">{i.title}</h5>
                  <img
                    src={getImageUrl(categoryImage)}
                    className="w-30 object-cover"
                    alt={i.title}
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Categories;