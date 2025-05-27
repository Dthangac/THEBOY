import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
      {/* Google Map */}
      <div className="my-9">
        <h2 className="text-2xl font-bold mb-4">
          Địa chỉ cửa hàng
        </h2>
        <div className="w-full h-[350px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.964013964839!2d106.6232205!3d10.8538977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b6c59ba4c97%3A0x535e784068f1558b!2zVHLGsOG7nW5nIENhbyDEkOG6oW5nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1717492345678!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map FPT Polytechnic"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Home;
