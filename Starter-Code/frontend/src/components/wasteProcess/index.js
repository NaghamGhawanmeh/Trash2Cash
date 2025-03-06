import React from "react";
import "./style.css";

const WasteRecyclingProcess = () => {
  const processSteps = [
    {
      id: "01",
      title: "Waste Pickup",
      description:
        "We pick your waste at your doorstep, dedicated team will reach on time to your locality.",
      icon: (
        <video autoPlay loop muted className="icon-video">
          <source
            src="https://cdn-icons-mp4.flaticon.com/512/11688/11688604.mp4"
            type="video/mp4"
          />
        </video>
      ),
    },
    {
      id: "02",
      title: "Waste Collection",
      description:
        "We collect all kinds of wastes like plastics, wood, iron, paper, etc.",
      icon: (
        <video autoPlay loop muted className="icon-video">
          <source
            src="https://cdn-icons-mp4.flaticon.com/512/14705/14705105.mp4"
            type="video/mp4"
          />
        </video>
      ),
    },
    {
      id: "03",
      title: "Processing",
      description:
        "After collection, payment is immediately transferred digitally or with cash to our customers.",
      icon: (
        <video autoPlay loop muted className="icon-video">
          <source
            src="https://cdn-icons-mp4.flaticon.com/512/18185/18185823.mp4"
            type="video/mp4"
          />
        </video>
      ),
    },
    {
      id: "04",
      title: "Recycling",
      description:
        "Transforming waste into valuable resources, conserving raw materials for a sustainable future.",
      icon: (
        <video autoPlay loop muted className="icon-video">
          <source
            src="https://cdn-icons-mp4.flaticon.com/512/18185/18185796.mp4"
            type="video/mp4"
          />
        </video>
      ),
    },
  ];

  return (
    <div id="process" className="recycling-container">
      <div className="recycling-header">
        <h3 className="recycling-subtitle">Our Process</h3>
        <h2 className="recycling-title">Waste Recycling Process</h2>
      </div>

      <div className="recycling-steps-desktop">
        {processSteps.map((step) => (
          <div key={step.id} className="recycling-step">
            <div className="icon-wrapper">
              <div className="icon-circle">{step.icon}</div>
            </div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-description">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WasteRecyclingProcess;
