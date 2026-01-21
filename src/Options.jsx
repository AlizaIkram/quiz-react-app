export const Options = ({ options, selected, onAnswer }) => {
  return (
    <div className="options">
      {options.map((option, index) => (
        <label
          key={index}
          className={`option-label ${selected === option ? "selected" : ""}`}
        >
          <input
            type="radio"
            name="option"
            value={option}
            checked={selected === option}
            onChange={() => onAnswer(option)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
};
