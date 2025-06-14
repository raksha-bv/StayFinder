import StayCard from "./StayCard";

const FeaturedStays = () => {
  const stays = [
    {
      images: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
      ],
      location: "Kollam, India",
      area: "Kollam beach",
      dates: "9-15 Jan",
      price: "₹2,568",
      rating: 4.79,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1586611292717-f828b167408c?w=400&h=400&fit=crop",
      ],
      location: "Vypin, India",
      area: "Vypin beach",
      dates: "9-15 Jan",
      price: "₹2,568",
      rating: 4.79,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
      ],
      location: "Munnar, India",
      area: "Tea gardens",
      dates: "16-22 Jan",
      price: "₹3,200",
      rating: 4.85,
      isGuestFavorite: false,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
      ],
      location: "Goa, India",
      area: "Anjuna beach",
      dates: "23-29 Jan",
      price: "₹4,100",
      rating: 4.92,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=400&fit=crop",
      ],
      location: "Alleppey, India",
      area: "Backwaters",
      dates: "30 Jan-5 Feb",
      price: "₹2,890",
      rating: 4.76,
      isGuestFavorite: false,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
      ],
      location: "Udaipur, India",
      area: "Lake Palace area",
      dates: "6-12 Feb",
      price: "₹5,200",
      rating: 4.88,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1502005229762-cf1b2da2db52?w=400&h=400&fit=crop",
      ],
      location: "Jaipur, India",
      area: "Pink City",
      dates: "13-19 Feb",
      price: "₹3,750",
      rating: 4.83,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
      ],
      location: "Rishikesh, India",
      area: "Ganges riverside",
      dates: "20-26 Feb",
      price: "₹2,200",
      rating: 4.71,
      isGuestFavorite: false,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
      ],
      location: "Coorg, India",
      area: "Coffee plantations",
      dates: "27 Feb-5 Mar",
      price: "₹3,450",
      rating: 4.91,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
      ],
      location: "Hampi, India",
      area: "Historical ruins",
      dates: "6-12 Mar",
      price: "₹1,890",
      rating: 4.67,
      isGuestFavorite: false,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=400&fit=crop",
      ],
      location: "Shimla, India",
      area: "Hill station",
      dates: "13-19 Mar",
      price: "₹2,980",
      rating: 4.74,
      isGuestFavorite: true,
    },
  ];

  return (
    <div className="py-16 px-6 sm:px-8 lg:px-12 xl:px-16">
      <div className="scrolling-container mb-8">
        <div className="horizontal-scrolling-items">
          <div className="horizontal-scrolling-items__item">
            Featured Stays • Featured Stays • Featured Stays • Featured Stays •
            Featured Stays • Featured Stays • Featured Stays • Featured Stays •&nbsp;
          </div>
          <div className="horizontal-scrolling-items__item">
            Featured Stays • Featured Stays • Featured Stays • Featured Stays •
            Featured Stays • Featured Stays • Featured Stays • Featured Stays •&nbsp;
          </div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 md:space-x-6 pb-4">
          {stays.map((stay, index) => (
            <div key={index} className="flex-shrink-0 w-64 sm:w-72">
              <StayCard {...stay} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes infiniteScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .scrolling-container {
          width: 100%;
          overflow-x: hidden;
        }

        .horizontal-scrolling-items {
          display: flex;
          font-size: 2rem;
          animation-name: infiniteScroll;
          animation-duration: 20s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }

        .horizontal-scrolling-items__item {
          white-space: nowrap;
          font-weight: 600;
          color: #111827;
        }

        @media (min-width: 768px) {
          .horizontal-scrolling-items {
            font-size: 3rem;
          }
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default FeaturedStays;
