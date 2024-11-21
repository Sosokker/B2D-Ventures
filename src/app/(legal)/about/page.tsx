"use client";
import { Separator } from "@/components/ui/separator";
import InfoCard from "./infoCard";
import FounderCard from "./founderCard";

export default function About() {
  // Static data for the cards
  const imageData = {
    img1: "https://assets.republic.com/assets/static_pages/about/growth_opportunities/individual_investors-0e85dfd02359a24ac4b232be008c7168fc57d3437a2f526f5d5889b874b20221.png",
    img2: "https://assets.republic.com/assets/static_pages/about/growth_opportunities/accredited_investors-42d6aa046861adb7f0648f26ca3f798b07f3b13bf7024f7dc17c17acb78fdf2c.png",
    img3: "https://assets.republic.com/assets/static_pages/about/growth_opportunities/entrepreneurs-a0ff450c2f3ba0cea82e2c55cd9265ad5612455c79ec831adaa2c94d09a0e617.png",
  };
  const founderData = [
    {
      name: "Sirisilp Kongsilp",
      position: "Tech, Business",
      profileLogo:
        "https://media.licdn.com/dms/image/v2/C5603AQE6NwFfhOWqrw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1642637269980?e=1737590400&v=beta&t=zh3GpG_d5lSxxZyFn6_RMgVtjz7lacqlpDwZ84BRpAA",
      background:
        "Founder and CEO of Perception, a holographic computer startup focused on innovative technologies like VR/AR and human-computer interaction. ",
    },
  ];

  return (
    <div className="container">
      <div className=" bg-neutral-100 dark:bg-neutral-800 w-full pb-5">
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
          <div className="grid grid-cols-1 md:grid-cols-[0.5fr,auto,0.5fr] gap-3">
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
            <Separator orientation="vertical" className="dark:bg-white" />
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
          <Separator className="mt-5 mb-5 dark:bg-white" />
          <InfoCard
            imageSrc={imageData.img3}
            imageAlt="Image3"
            heading="Entrepreneurs"
            content={[
              "Seek funding from a wider base of diverse",
              "investors while simultaneously growing a loyal",
              "base and leveraging Republic's private investment",
              "network.",
            ]}
            link="/project/apply"
            buttonText="Raise money"
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-24">
        <h1 className="font-black text-5xl ">Built by an experience team with deep </h1>
        <h1 className="font-black text-5xl ">expertise in private investing</h1>
        <h1 className="text-gray-500 text-2xl mt-2">B2D Ventures was established by innovators with experience in</h1>
        <h1 className="text-gray-500 text-2xl">top investment platforms and entrepreneurial ecosystems. Since then,</h1>
        <h1 className="text-gray-500 text-2xl">we have built a team and a network of the top people from</h1>
        <h1 className="text-gray-500 text-2xl">the startup, venture capital, and investment worlds.</h1>
        <div className="flex flex-col items-center mt-8">
          <Separator className="w-full h-1 bg-primary mb-2"></Separator>
          <h2 className="text-3xl font-bold text-center text-primary">Meet the Minds Behind the Innovation.</h2>
        </div>

        <div className="mt-10">
          {founderData.map((profile) => {
            return (
              <FounderCard
                image={profile.profileLogo}
                name={profile.name}
                position={profile.position}
                background={profile.background}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
