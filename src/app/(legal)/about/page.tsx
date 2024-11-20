"use client";
import { Separator } from "@/components/ui/separator";
import InfoCard from "./infoCard";

export default function About() {
  // Static data for the cards
  const cardData = [
    {
      imageSrc: "https://avatars.githubusercontent.com/u/86756025",
      name: "Pattadon Loyprasert",
      description:
        "Driven by a passion for innovation, Pattadon leads B2D Ventures with the belief that" +
        "every great idea deserves the resources and support to thrive. He’s dedicated to" +
        "helping entrepreneurs turn visions into reality.",
    },
    {
      imageSrc: "https://avatars.githubusercontent.com/u/22256420",
      name: "Sirin Puenggun",
      description:
        "Sirin brings a wealth of experience in empowering entrepreneurs, aiming to" +
        "create an ecosystem where bold ideas meet the right partners. He’s committed to" +
        "making a lasting impact on the entrepreneurial world.",
    },
    {
      imageSrc: "https://avatars.githubusercontent.com/u/108450436",
      name: "Naytitorn Chaovirachot",
      description:
        "With a strong foundation in collaboration and trust, Naytitorn is focused" +
        "on building lasting partnerships that help drive the success of both investors and founders." +
        "He thrives on turning challenges into growth opportunities.",
    },
    {
      imageSrc: "https://avatars.githubusercontent.com/u/114897362",
      name: "Nantawat Sukrisunt",
      description:
        "Nantawat is a passionate advocate for innovation and teamwork." +
        "He strives to foster a community where both investors and startups can achieve" +
        "their full potential, creating a future where collaboration leads to success.",
    },
  ];

  const imageData = {
    img1: "https://assets.republic.com/assets/static_pages/about/growth_opportunities/individual_investors-0e85dfd02359a24ac4b232be008c7168fc57d3437a2f526f5d5889b874b20221.png",
    img2: "https://assets.republic.com/assets/static_pages/about/growth_opportunities/accredited_investors-42d6aa046861adb7f0648f26ca3f798b07f3b13bf7024f7dc17c17acb78fdf2c.png",
    img3: "https://assets.republic.com/assets/static_pages/about/growth_opportunities/entrepreneurs-a0ff450c2f3ba0cea82e2c55cd9265ad5612455c79ec831adaa2c94d09a0e617.png",
  };

  return (
    <div className="container  bg-neutral-100">
      <div className="">
        <div className="flex flex-col items-center justify-center">
          <h1 className="mt-3  text-lg md:text-5xl font-black">Growth opportunities for all sides </h1>
          <h1 className="mt-3 text-lg md:text-5xl font-black">of the investment market</h1>
          <h1 className="text-gray-500 text-2xl mt-1">
            B2DVentures is where both accredited and non-accredited investors meet
          </h1>
          <h1 className="text-gray-500 text-2xl">
            entrepreneurs and access high-growth potential deals across a range
          </h1>
          <h1 className="text-gray-500 text-2xl">of private markets.</h1>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3">
            <InfoCard
              imageSrc={imageData.img1}
              imageAlt="Image1"
              heading="Individual investors"
              content={[
                "B2DVentures's success has been built off our hundreds",
                "of sourced private deals, all available for",
                "investment from you with as little as $10 or as ",
                "much as $124,000.",
              ]}
              link="/deals"
              buttonText="Explore opportunities"
            />
            <Separator orientation="vertical" />
            <InfoCard
              imageSrc={imageData.img2}
              imageAlt="Image2"
              heading="Accredited investors"
              content={[
                "The benefits of the Republic platform, optimized for",
                "accredited investors. Access a curated investor",
                "portal for unique private investment opportunities. ",
              ]}
              link="/dataroom/overview"
              buttonText="Learn more"
            />
          </div>
          <Separator className="mt-5 mb-5" />
          <InfoCard
            imageSrc={imageData.img3}
            imageAlt="Image3"
            heading="Entrepreneurs"
            content={[
              "Seek funding from a wider base of diverse",
              "investors while simultaneously growing a loyal",
              "base and leveraging Republic’s private investment",
              "network.",
            ]}
            link="/project/apply"
            buttonText="Raise money"
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-10">
        <h1 className="font-black text-5xl ">Built by a diverse team with deep </h1>
        <h1 className="font-black text-5xl ">expertise in private investing</h1>
      </div>

      {/* <div className="border border-border rounded-md">
        <p className="p-5">
          Welcome to B2D Ventures! We&apos;re a dynamic platform committed to bridging the gap between visionary
          entrepreneurs and passionate investors. Our mission is to empower innovation by connecting groundbreaking
          ideas with the resources they need to thrive. Through B2D Ventures, we foster a community where investors and
          innovators come together to transform concepts into impactful, real-world solutions.
        </p>
        <p className="p-5">
          At B2D Ventures, we believe in the power of collaboration. Whether you&apos;re an investor looking to support
          the next big idea or a founder aiming to bring your vision to life, our platform offers the tools and
          connections to make it happen. Join us on a journey to reshape industries, drive positive change, and make a
          lasting impact.
        </p>
        <p className="p-5">Let&apos;s build the future, together.</p>
      </div> */}

      {/* <div className="mt-10 text-center">
        <h2 className="font-bold text-lg md:text-3xl">Our Team</h2>
        <Separator className="my-3" />
      </div> */}

      {/* Card Section */}
      {/* <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Image src={card.imageSrc} width={460} height={460} alt={card.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="pt-5 text-xl font-semibold text-gray-800 text-center">{card.name}</h3>
              <p className="pt-5 text-gray-600 mt-2">{card.description}</p>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}
