import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link } from 'react-router-dom';
import { Form, Button, Container, Header } from 'semantic-ui-react'
import { ADD_PROFILE, UPDATE_PROFILE, REMOVE_PROFILE } from '../utils/mutations.js';
import { QUERY_PROFILES } from "../utils/queries.js";

const Profile = () => {
  // State for Add Form
  const [addFormState, setAddFormState] = useState({
    petName: "",
    age: "",
    breed: "",
    foodBrand: "",
    humanName: "",
  });

  // State for Update Form
  const [updateFormState, setUpdateFormState] = useState([]);

  // Fetch all profiles data
  // use refetch to execute refresh in some situations
  const { loading, data, refetch } = useQuery(QUERY_PROFILES, { onCompleted: (data) => setUpdateFormState(data.profiles) });

  // Post profile data
  const [addProfile, { error: addError }] = useMutation(ADD_PROFILE);

  const [updateProfile, { error: updateError }] = useMutation(UPDATE_PROFILE);

  const [removeProfile, { error: removeError }] = useMutation(REMOVE_PROFILE);

  // Update state based on Add Form input changes
  const handleChangeAdd = (event) => {
    const { name, value } = event.target;

    setAddFormState({
      ...addFormState,
      [name]: value,
    });
  };

  // Update state based on Update Form input changes
  const handleChangeUpdate = (index, event) => {
    const { name, value } = event.target;

    const newUpdateFormState = updateFormState.map((profile, i) => {
      if (i === index) {
        return {
          ...profile,
          [name]: value,
        }
      }

      return profile
    })

    setUpdateFormState(newUpdateFormState);
  };

  // Submit form for Add Profile
  const handleFormSubmitAdd = async (event) => {
    event.preventDefault();
    console.log(addFormState);

    try {
      const { data } = await addProfile({
        variables: { ...addFormState },
      });
      console.log(data);

      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  // Submit form for Update Profile
  const handleFormSubmitUpdate = async (index, event) => {
    event.preventDefault();
    console.log(updateFormState[index]);

    try {
      const { data } = await updateProfile({
        variables: { ...updateFormState[index] },
      });
      console.log(data);

      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Button click for Remove Profile
  const handleFormRemove = async (id, event) => {
    event.preventDefault();

    try {
      const { data } = await removeProfile({
        variables: { profileId: id },
      });
      console.log(data);

      refetch();
    } catch (e) {
      console.error(e);
    }
  };
// styling
const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'column',
    textAlign: 'center'
}

const cardStyle = {
    margin: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center'
}

const formStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '500px',
    padding: 20 
}
  return (
    // Form for pet profile
    <Container style={containerStyle}>
      <div className="profile-page">
        <Header className="">Please Add Your Dog's Profile Here</Header>
        <div style={cardStyle}>
          <Form style={formStyle} onSubmit={handleFormSubmitAdd}>
            <Form.Group widths='equal'>
              <Form.Field >
                {/* input for pet name */}
                <label>Pet Name</label>
                  <input
                    className=""
                    placeholder="Peanut Wigglebutt"
                    name="petName"
                    type="text"
                    value={addFormState.petName}
                    onChange={handleChangeAdd}
                  />
              </Form.Field>
              {/* input for pet's age */}
              <Form.Field>
              <label>Pet Age</label>
                <input
                  className=""
                  placeholder="Your pet age"
                  name="age"
                  type="number"
                  value={addFormState.age}
                  onChange={handleChangeAdd}
                />
              </Form.Field>
              <Form.Field>
                {/* input for dog breed */}
              <label>Breed of Your Pet</label>
                <input
                  className=""
                  placeholder="Beagle"
                  name="breed"
                  type="text"
                  value={addFormState.breed}
                  onChange={handleChangeAdd}
                />
              </Form.Field>
              <Form.Field>
                {/* input for pet food brand */}
              <label>Brand of Pet Food</label>
                <input
                  className=""
                  placeholder="Royal Canin"
                  name="foodBrand"
                  type="text"
                  value={addFormState.foodBrand}
                  onChange={handleChangeAdd}
                />
              </Form.Field>
              <Form.Field>
                {/* input for owner's name */}
              <label>Owner's name</label>
                <input
                  className=""
                  placeholder="Owner's name"
                  name="humanName"
                  type="text"
                  value={addFormState.humanName}
                  onChange={handleChangeAdd}
                />
              </Form.Field>

              <Button primary centered
                className="profile-btn"
                style={{ cursor: "pointer", margin: 8 }}
                type="submit"
              >
                Add Profile
              </Button>
            </Form.Group>
          </Form>
          {addError && <div className="">{addError.message}</div>}
        </div>
      </div>
      <br /><br />
      <div className="">

        <div className="">
          {loading ? (
            <div>Loading profile...</div>
          ) : (
            data && data.profiles && data.profiles.length > 0 && 
            <div>
                <Card key={profile._id} className="profile-render">
                  <Link to={{ pathname: `/profile/${profile._id}` }}>
                    {profile.petName} 🦴<br/> 
                  </Link>
                </Card>
                </div>)
          }
          {updateError && <div className="">{updateError.message}</div>}
          {removeError && <div className="">{removeError.message}</div>}
        </div>
      </div>
      <Link to="/">
          <Button primary className='vet-note-nav-btns'>Back Home</Button>
        </Link>
    </Container>
    
  );
};

export default Profile;
