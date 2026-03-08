const handleInputChange = (setState) => (event) => {
  const { name, value } = event.target;

  setState((prev) => ({
    ...prev,
    [name]: value,
  }));
};

export default handleInputChange;
