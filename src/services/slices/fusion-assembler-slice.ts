import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

interface FusionAssemblerState {
  primaryComponent: TConstructorIngredient | null;
  assemblyComponents: TConstructorIngredient[];
}

const initialFusionState: FusionAssemblerState = {
  primaryComponent: null,
  assemblyComponents: []
};

const fusionAssemblerSlice = createSlice({
  name: 'fusionAssembler',
  initialState: initialFusionState,
  reducers: {
    addComponentToAssembly: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const component = action.payload;

      if (!component || !component._id || !component.type || !component.id) {
        console.warn('Invalid component data:', component);
        return state;
      }

      if (component.type === 'bun') {
        state.primaryComponent = component;
      } else {
        state.assemblyComponents.push(component);
      }
    },

    removeComponentFromAssembly: (state, action: PayloadAction<string>) => {
      const componentId = action.payload;

      if (!componentId) {
        console.warn('Invalid component ID for removal');
        return state;
      }

      state.assemblyComponents = state.assemblyComponents.filter(
        (component) => component.id !== componentId
      );
    },

    rearrangeAssemblyComponents: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;

      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.assemblyComponents.length ||
        toIndex >= state.assemblyComponents.length
      ) {
        console.warn('Invalid indices for rearrangement');
        return state;
      }

      const components = [...state.assemblyComponents];
      const [movedComponent] = components.splice(fromIndex, 1);
      components.splice(toIndex, 0, movedComponent);
      state.assemblyComponents = components;
    },

    resetFusionAssembler: (state) => {
      state.primaryComponent = null;
      state.assemblyComponents = [];
    }
  }
});

export const {
  addComponentToAssembly,
  removeComponentFromAssembly,
  rearrangeAssemblyComponents,
  resetFusionAssembler
} = fusionAssemblerSlice.actions;

export default fusionAssemblerSlice.reducer;
