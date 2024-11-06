import Image from "next/image";

export default function About() {
  // Static data for the cards
  const cardData = [
    {
      imageSrc: 'https://avatars.githubusercontent.com/u/86756025',
      name: 'Pattadon Loyprasert',
      description:
        'Driven by a passion for innovation, Pattadon leads B2D Ventures with the belief that' +
        'every great idea deserves the resources and support to thrive. He’s dedicated to' +
        'helping entrepreneurs turn visions into reality.',
    },
    {
      imageSrc: 'https://avatars.githubusercontent.com/u/22256420',
      name: 'Sirin Puenggun',
      description: 
        'Sirin brings a wealth of experience in empowering entrepreneurs, aiming to' +
        'create an ecosystem where bold ideas meet the right partners. He’s committed to' +
        'making a lasting impact on the entrepreneurial world.',
    },
    {
      imageSrc: 'https://avatars.githubusercontent.com/u/108450436',
      name: 'Naytitorn Chaovirachot',
      description: 
        'With a strong foundation in collaboration and trust, Naytitorn is focused' +
        'on building lasting partnerships that help drive the success of both investors and founders.' +
        'He thrives on turning challenges into growth opportunities.',
    },
    {
      imageSrc: 'https://avatars.githubusercontent.com/u/114897362',
      name: 'Nantawat Sukrisunt',
      description: 
        'Nantawat is a passionate advocate for innovation and teamwork.' +
        'He strives to foster a community where both investors and startups can achieve' +
        'their full potential, creating a future where collaboration leads to success.',
    },
  ];

  return (
    <div className="p-10">
      <h1 className="mt-3 font-bold text-lg md:text-3xl">About us</h1>
      <p className="p-5">
        Welcome to B2D Ventures! We&apos;re a dynamic platform committed to bridging the gap
        between visionary entrepreneurs and passionate investors. Our mission is to empower
        innovation by connecting groundbreaking ideas with the resources they need to thrive.
        Through B2D Ventures, we foster a community where investors and innovators come together
        to transform concepts into impactful, real-world solutions.
      </p>
      <p className="p-5">
        At B2D Ventures, we believe in the power of collaboration. Whether you&apos;re an investor
        looking to support the next big idea or a founder aiming to bring your vision to life,
        our platform offers the tools and connections to make it happen.
        
        Join us on a journey to reshape industries, drive positive change, and make a lasting impact.
      </p>
      <p className="p-5">
        Let&apos;s build the future, together.
      </p>

      <div className="mt-10 text-center">
        <h2 className="font-bold text-lg md:text-3xl">Our Team</h2>
      </div>

      {/* Card Section */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Image src={card.imageSrc} width={460} height={460} alt={card.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="pt-5 text-xl font-semibold text-gray-800 text-center">{card.name}</h3>
              <p className="pt-5 text-gray-600 mt-2">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}