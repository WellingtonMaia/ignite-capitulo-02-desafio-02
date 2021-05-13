import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useEffect, useState } from 'react';

interface FoodEntity {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

export function Dashboard() {
  const [foods, setFoods] = useState<FoodEntity[]>([]);
  const [editingFood, setEditingFood] = useState<FoodEntity>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);  

  useEffect(() => {
    
    async function getFoodsFromApi() {
      const response = await api.get('/foods');
      const foodsApi = response.data;
      console.log(foodsApi);
      setFoods([...foodsApi]);
    }

    getFoodsFromApi();
  },[]);

  const handleAddFood = async (food: FoodEntity) => {
    const newFood = [...foods];
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...newFood, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodEntity) => {

    try {
      const foodsUpdated = [...foods];
      const foodUpdated = await api.put(
        `/foods/${editingFood?.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdatedApi = foodsUpdated?.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );
      setFoods([...foodsUpdatedApi])
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    const foodsUpdate = [...foods];

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foodsUpdate.filter(food => food.id !== id);
    setFoods([...foodsFiltered]);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: FoodEntity) => {
    setEditingFood({...food});
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};