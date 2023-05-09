import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeASpot } from "../../store/spots";
import "./SpotForm.css";

const NewSpotForm = () => {
  // const sessionUser = useSelector((state) => state.session.user);
  // console.log("SessionUser", sessionUser);
  const dispatch = useDispatch();
  const history = useHistory();

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const errors = {};
    if (!country || country.length < 5 || country.length > 50)
      errors.country =
        "Country must exist and must be greater than 5 characters and less than 50 characters.";
    if (!address || address.length < 5 || address.length > 255)
      errors.address =
        "Address must exist and must be greater than 5 characters and less than 255 characters.";
    if (!city || city.length < 5 || city.length > 50)
      errors.city =
        "City must exist and must be greater than 5 characters and less than 50 characters.";
    if (!state || state.length < 2 || state.length > 50)
      errors.state =
        "State must exist and must be greater than 2 characters and less than 50 characters.";
    // if(!lat) errors.lat = "Please enter a latitude."
    // if(!lng) errors.lng = "Please enter a longitude."
    if (!description || description.length < 10 || description.length > 500)
      errors.description =
        "Description must exist and must be greater than 10 characters and less than 500 characters.";
    if (!name || name.length < 5 || name.length > 50)
      errors.name =
        "Name must exist and must be greater than 5 characters and less than 50 characters.";
    if (!price || price < 0)
      errors.price = "Price must have a minimum of $0 a night.";
    if (!image) errors.image = "Please provide at least 1 image.";
    setValidationErrors(errors);
  }, [country, address, city, state, description, name, price, image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
     const newSpot = {
        country,
        address,
        city,
        state,
        lat,
        lng,
        description,
        name,
        price,
        image,
      };

      console.log("In submit", newSpot)

    const makeNewSpot = await dispatch(makeASpot(newSpot));
    console.log("This is the dispatch", makeNewSpot)

    history.push(`/spots/${makeNewSpot.id}`);

  };

  return (
    <>
      <form className="spot-form" onSubmit={handleSubmit}>
        <h2>Create a new Spot</h2>
        <div className="location-container">
          <p>Where's your place located?</p>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <label>
            Country
            <input
              type="text"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            {validationErrors.country && (
              <p className="errors">{validationErrors.country}</p>
            )}
          </label>
          <label>
            Street Address
            <input
              type="text"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          {validationErrors.address && (
            <p className="errors">{validationErrors.address}</p>
          )}
          <label className>
            City
            <input
              type="text"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          {validationErrors.city && (
            <p className="errors">{validationErrors.city}</p>
          )}
          <label>
            State
            <input
              type="text"
              name="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </label>
          {validationErrors.state && (
            <p className="errors">{validationErrors.state}</p>
          )}
        </div>

        <div className="description-container">
          <label>
            <h2>Describe your place to guests</h2>
            <p>
              Mention the best features of your space, any special amentities
              like fast wifi or parking, and what you love about the
              neighborhood.
            </p>
            <textarea
              className="text-area"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="10"
              placeholder="Please write description of home"
            ></textarea>
          </label>
          {validationErrors.description && (
            <p className="errors">{validationErrors.description}</p>
          )}
        </div>

        <div className="title-place">
          <label>
            <h2>Create a title for your Spot</h2>
            <p>
              Catch guests' attention with a spot title that highlights what
              makes your place special.
            </p>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          {validationErrors.name && (
            <p className="errors">{validationErrors.name}</p>
          )}
        </div>

        <div className="price-container">
          <label>
            <h2>Set a base price for your spot</h2>
            <p>
              Competitive pricing can help your listing stand out and rank
              higher in search results.
            </p>
            <input
              type="text"
              name="number"
              placeholder="$"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
          {validationErrors.price && (
            <p className="errors">{validationErrors.price}</p>
          )}
        </div>

        <div className="url-container">
          <label>
            <h2>Liven up your spot with photos</h2>
            <p>Submit a link to atleast one photo to publish your spot</p>
            <input
              type="text"
              name="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <input type="text" name="url" />
            <input type="text" name="url" />
            <input type="text" name="url" />
          </label>
          {validationErrors.image && (
            <p className="errors">{validationErrors.image}</p>
          )}
        </div>

        <button
          type="submit"
          className="create-spot-button"
          disabled={Object.keys(validationErrors).length ? true : false}
        >
          Create Spot
        </button>
      </form>
    </>
  );
};

export default NewSpotForm;
