import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPills, FaMinus, FaPlus } from 'react-icons/fa';
import { IoMdWater } from 'react-icons/io';
import { RiSyringeLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { addMedication, updateMedication, getMedication, Medication } from '../services/medicationService';
import { motion } from 'framer-motion';

interface IFormInput {
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  type: string;
  interval: string;
  instruction: string;
  time: string;
  image: FileList;
}

const AddMedicationPage: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<IFormInput>({
    defaultValues: {
      dosage: '0'
    }
  });
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const dosage = watch('dosage');
  const image = watch('image');

  useEffect(() => {
    const fetchMedication = async () => {
      if (id && user) {
        try {
          const medication = await getMedication(id, user.uid);
          if (medication) {
            Object.entries(medication).forEach(([key, value]) => {
              setValue(key as keyof IFormInput, value);
            });
            setSelectedType(medication.type);
            setSelectedInterval(medication.interval);
            setSelectedTime(medication.time);
            if (medication.imageUrl) {
              setImagePreview(medication.imageUrl);
            }
          }
        } catch (error) {
          console.error("Error fetching medication:", error);
        }
      }
    };

    fetchMedication();
  }, [id, user, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (user) {
      try {
        const { image, ...medicationData } = data;
        const imageFile = image && image.length > 0 ? image[0] : undefined;

        if (id) {
          await updateMedication(id, { ...medicationData, userId: user.uid }, imageFile);
          navigate('/medications', { state: { message: 'Medication updated successfully!', type: 'update' } });
        } else {
          await addMedication({ ...medicationData, userId: user.uid }, imageFile);
          navigate('/medications', { state: { message: 'Medication added successfully!', type: 'add' } });
        }
      } catch (error) {
        console.error("Error adding/updating medication:", error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  const handleDosageChange = (increment: number) => {
    const currentDosage = parseInt(dosage) || 0;
    const newDosage = Math.max(0, currentDosage + increment);
    setValue('dosage', newDosage.toString());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 p-6 text-white border-4 border-primary rounded-lg"
    >
      <h1 className="text-2xl font-bold text-primary mb-6">{id ? 'Edit' : 'Create'} Medication</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="medicationName" className="block mb-1 text-sm font-medium text-gray-300">
            Medicine Name
          </label>
          <input
            type="text"
            id="medicationName"
            className="input bg-gray-700 text-white border-gray-600 focus:border-primary"
            placeholder="Enter medicine name"
            {...register("medicationName", { required: "Medicine name is required" })}
          />
          {errors.medicationName && <p className="mt-1 text-sm text-red-400">{errors.medicationName.message}</p>}
        </div>

        <div>
          <label htmlFor="dosage" className="block mb-1 text-sm font-medium text-gray-300">
            Dosage
          </label>
          <div className="relative">
            <input
              type="text"
              id="dosage"
              className="input bg-gray-700 text-white border-gray-600 focus:border-primary text-center"
              readOnly
              {...register("dosage", { required: "Dosage is required" })}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <button
                type="button"
                className="text-gray-400 hover:text-white focus:outline-none"
                onClick={() => handleDosageChange(-1)}
              >
                <FaMinus className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                className="text-primary hover:text-primary-dark focus:outline-none"
                onClick={() => handleDosageChange(1)}
              >
                <FaPlus className="w-4 h-4" />
              </button>
            </div>
          </div>
          {errors.dosage && <p className="mt-1 text-sm text-red-400">{errors.dosage.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-300">
            Type
          </label>
          <div className="mt-2 flex space-x-4">
            {['Pill', 'Liquid', 'Syringe'].map((type) => (
              <button
                key={type}
                type="button"
                className={`flex-1 py-2 px-4 border rounded-md flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary ${
                  selectedType === type 
                    ? 'border-primary bg-primary bg-opacity-20 text-primary' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => {
                  setSelectedType(type);
                  setValue('type', type);
                }}
              >
                {type === 'Pill' && <FaPills className={`h-5 w-5 ${selectedType === type ? 'text-primary' : 'text-gray-400'}`} />}
                {type === 'Liquid' && <IoMdWater className={`h-5 w-5 ${selectedType === type ? 'text-primary' : 'text-gray-400'}`} />}
                {type === 'Syringe' && <RiSyringeLine className={`h-5 w-5 ${selectedType === type ? 'text-primary' : 'text-gray-400'}`} />}
                <span>{type}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-300">
            Interval
          </label>
          <div className="mt-2 flex space-x-4">
            {['Daily', 'Weekly', 'Monthly'].map((interval) => (
              <button
                key={interval}
                type="button"
                className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  selectedInterval === interval
                    ? 'bg-primary text-white'
                    : 'border border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => {
                  setSelectedInterval(interval);
                  setValue('interval', interval);
                }}
              >
                {interval}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="frequency" className="block mb-1 text-sm font-medium text-gray-300">
            Time
          </label>
          <input
            type="time"
            id="frequency"
            className="input bg-gray-700 text-white border-gray-600 focus:border-primary"
            {...register("frequency", { required: "Time is required" })}
          />
          {errors.frequency && <p className="mt-1 text-sm text-red-400">{errors.frequency.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block mb-1 text-sm font-medium text-gray-300">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              className="input bg-gray-700 text-white border-gray-600 focus:border-primary"
              {...register("startDate")}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block mb-1 text-sm font-medium text-gray-300">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              className="input bg-gray-700 text-white border-gray-600 focus:border-primary"
              {...register("endDate")}
            />
          </div>
        </div>

        <div>
          <label htmlFor="instruction" className="block mb-1 text-sm font-medium text-gray-300">
            Instruction
          </label>
          <select
            id="instruction"
            className="input bg-gray-700 text-white border-gray-600 focus:border-primary"
            {...register("instruction", { required: "Instruction is required" })}
          >
            <option value="">Select instruction</option>
            <option value="Before meal">Before meal</option>
            <option value="After meal">After meal</option>
            <option value="With meal">With meal</option>
            <option value="With water">With water</option>
            <option value="Without water">Without water</option>
          </select>
          {errors.instruction && <p className="mt-1 text-sm text-red-400">{errors.instruction.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-300">
            Time
          </label>
          <div className="mt-2 flex space-x-4">
            {['Morning', 'Afternoon', 'Night'].map((time) => (
              <button
                key={time}
                type="button"
                className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  selectedTime === time
                    ? 'bg-primary text-white'
                    : 'border border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => {
                  setSelectedTime(time);
                  setValue('time', time.toLowerCase());
                }}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block mb-1 text-sm font-medium text-gray-300">
            Medication Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            className="input bg-gray-700 text-white border-gray-600 focus:border-primary"
            {...register("image")}
          />
          {imagePreview && (
            <img src={imagePreview} alt="Medication preview" className="mt-2 w-32 h-32 object-cover rounded-md" />
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button type="submit" className="btn btn-primary w-full">
            {id ? 'Update' : 'Create'} Medication
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AddMedicationPage;