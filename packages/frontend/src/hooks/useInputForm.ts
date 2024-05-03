import {useRouter} from 'next/router';
import {
  ChangeEventHandler,
  DragEventHandler,
  FormEventHandler,
  ReactEventHandler,
  useEffect,
  useState,
} from 'react';
import {AppState, SlotCollection, MAXIMUM_IMAGES, Slide, SLIDE_LAYOUTS, ImageSlotContent} from '@symphco/mecha-kucha-common';

interface UseInputFormParams {
  refresh?: (...args: unknown[]) => unknown;
}

export const useInputForm = (params = {} as UseInputFormParams) => {
  const router = useRouter();
  const [working, setWorking] = useState<string>();
  const [formKey, setFormKey] = useState<number>();
  const [slideImageLoading, setSlideImageLoading] = useState([] as number[]);
  const [appState, setAppState] = useState<AppState>(
    // {
    //   "title": "Next.js development",
    //   "input": "Part 1: Seeds\nTheme: Germination\n\nDescription: Just like seeds waiting to sprout, starting a Next.js project is the beginning of growth. Setting up the project structure, dependencies, and configurations is akin to planting the seed of a robust application. \n\nPart 2: Blueprints\nTheme: Architectural Plans\n\nDescription: Planning the layout and components of a Next.js project is similar to creating architectural blueprints for a building. Designing the overall structure and flow of the application sets the foundation for a successful development process.\n\nPart 3: Tools\nTheme: Toolbox\n\nDescription: Utilizing tools like the Next.js CLI, extensions, and libraries is like having a well-equipped toolbox for a project. These tools streamline development tasks, enhance performance, and provide solutions to common challenges.\n\nPart 4: Routes\nTheme: Pathways\n\nDescription: Defining routes in a Next.js project is like mapping out pathways in a city. Routing helps navigate users through different pages and sections of the application, ensuring a seamless browsing experience.\n\nPart 5: Components\nTheme: Building Blocks\n\nDescription: Components in Next.js act as the building blocks of the application, similar to how bricks come together to construct a building. Reusable, modular components enhance code reusability, maintainability, and scalability.\n\nPart 6: Styling\nTheme: Wardrobe\n\nDescription: Styling a Next.js project is like dressing it up with a unique wardrobe. Using CSS frameworks, preprocessors, or styled-components adds visual appeal and enhances the user interface design.\n\nPart 7: State Management\nTheme: Central Nervous System\n\nDescription: State management in Next.js serves as the central nervous system of the application, coordinating data flow and interactions between components. Implementing tools like Redux or Context API helps maintain a consistent state across the application.\n\nPart 8: APIs\nTheme: Connectors\n\nDescription: Integrating APIs into a Next.js project is like fitting connectors to establish communication with external services. Fetching data from APIs enables dynamic content, real-time updates, and interactive features in the application.\n\nPart 9: Optimization\nTheme: Fine-Tuning\n\nDescription: Optimizing a Next.js project involves fine-tuning performance, enhancing user experience, and improving loading times. Techniques like code splitting, lazy loading, and image optimization help streamline the application.\n\nPart 10: Testing\nTheme: Quality Control\n\nDescription: Testing a Next.js project ensures quality control and identifies potential bugs or issues before deployment. Conducting unit tests, integration tests, and end-to-end tests helps maintain the reliability and functionality of the application.\n\nPart 11: Deployment\nTheme: Launch Pad\n\nDescription: Deploying a Next.js project is like preparing for launch from a launch pad. Configuring servers, setting up environments, and deploying the application to production ensure it is accessible to users worldwide.\n\nPart 12: Monitoring\nTheme: Surveillance\n\nDescription: Monitoring a Next.js project involves keeping a watchful eye on performance metrics, error logs, and user interactions. Monitoring tools help identify issues, track trends, and optimize the application for better performance.\n\nPart 13: Updates\nTheme: Evolution\n\nDescription: Updating a Next.js project is like facilitating its evolution over time. Implementing new features, fixing bugs, and adapting to changing requirements ensures the application remains relevant and competitive in the market.\n\nPart 14: Documentation\nTheme: Guidebook\n\nDescription: Documenting a Next.js project is like creating a guidebook for developers to understand the codebase, architecture, and functionalities. Comprehensive documentation enhances collaboration, onboarding, and maintenance of the application.\n\nPart 15: Community\nTheme: Ecosystem\n\nDescription: Being part of the Next.js community is like contributing to a thriving ecosystem of developers, designers, and enthusiasts. Engaging with the community through forums, events, and open source projects fosters learning, collaboration, and innovation.",
    //   "slides": [
    //     {
    //       "id": "f390168f-1035-4f4b-8a0e-7f804db614af",
    //       "imageUrls": [
    //         "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwxfHxHZXJtaW5hdGlvbnxlbnwwfHx8fDE3MTEwODYzOTd8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwyfHxHZXJtaW5hdGlvbnxlbnwwfHx8fDE3MTEwODYzOTd8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1526731208095-737ad4b3eaaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwzfHxHZXJtaW5hdGlvbnxlbnwwfHx8fDE3MTEwODYzOTd8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1583515395735-eb9b0eda3eb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw0fHxHZXJtaW5hdGlvbnxlbnwwfHx8fDE3MTEwODYzOTd8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1637342931868-47e8d1fec59e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw1fHxHZXJtaW5hdGlvbnxlbnwwfHx8fDE3MTEwODYzOTd8MA&ixlib=rb-4.0.3&q=80&w=1080"
    //       ],
    //       "layout": "grid-left",
    //       "text": "Description: Just like seeds waiting to sprout, starting a Next.js project is the beginning of growth. Setting up the project structure, dependencies, and configurations is akin to planting the seed of a robust application.",
    //       "visibleSlots": 5,
    //       "title": "Seeds",
    //       "theme": "Germination"
    //     },
    //     {
    //       "id": "037aada3-e07c-478d-be53-ea4be2a27fca",
    //       "imageUrls": [
    //         "https://images.unsplash.com/photo-1608303588026-884930af2559?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwxfHxBcmNoaXRlY3R1cmFsJTIwUGxhbnN8ZW58MHx8fHwxNzExMDg2Mzk4fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1610650394144-a778795cf585?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwyfHxBcmNoaXRlY3R1cmFsJTIwUGxhbnN8ZW58MHx8fHwxNzExMDg2Mzk4fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1542621334-a254cf47733d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwzfHxBcmNoaXRlY3R1cmFsJTIwUGxhbnN8ZW58MHx8fHwxNzExMDg2Mzk4fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1568057372630-7e970893d189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw0fHxBcmNoaXRlY3R1cmFsJTIwUGxhbnN8ZW58MHx8fHwxNzExMDg2Mzk4fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1598368195835-91e67f80c9d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw1fHxBcmNoaXRlY3R1cmFsJTIwUGxhbnN8ZW58MHx8fHwxNzExMDg2Mzk4fDA&ixlib=rb-4.0.3&q=80&w=1080"
    //       ],
    //       "layout": "grid-left",
    //       "text": "Description: Planning the layout and components of a Next.js project is similar to creating architectural blueprints for a building. Designing the overall structure and flow of the application sets the foundation for a successful development process.",
    //       "visibleSlots": 2,
    //       "title": "Blueprints",
    //       "theme": "Architectural Plans"
    //     },
    //     {
    //       "id": "a184e17d-9d43-4893-a92a-c609ee9d2b54",
    //       "imageUrls": [
    //         "https://images.unsplash.com/photo-1558906050-d6d6aa390fd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwxfHxUb29sYm94fGVufDB8fHx8MTcxMTA4NjM5OHww&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1585569695919-db237e7cc455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwyfHxUb29sYm94fGVufDB8fHx8MTcxMTA4NjM5OHww&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1426927308491-6380b6a9936f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwzfHxUb29sYm94fGVufDB8fHx8MTcxMTA4NjM5OHww&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1581085271555-d32ebe05933a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw0fHxUb29sYm94fGVufDB8fHx8MTcxMTA4NjM5OHww&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1618090584126-129cd1f3fbae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw1fHxUb29sYm94fGVufDB8fHx8MTcxMTA4NjM5OHww&ixlib=rb-4.0.3&q=80&w=1080"
    //       ],
    //       "layout": "grid-right",
    //       "text": "Description: Utilizing tools like the Next.js CLI, extensions, and libraries is like having a well-equipped toolbox for a project. These tools streamline development tasks, enhance performance, and provide solutions to common challenges.",
    //       "visibleSlots": 4,
    //       "title": "Tools",
    //       "theme": "Toolbox"
    //     },
    //     {
    //       "id": "0c3bc52a-d723-41eb-84aa-56a58c07ed07",
    //       "imageUrls": [
    //         "https://images.unsplash.com/photo-1505028106030-e07ea1bd80c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwxfHxQYXRod2F5c3xlbnwwfHx8fDE3MTEwODYzOTl8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1548147963-30ac0d3d7723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwyfHxQYXRod2F5c3xlbnwwfHx8fDE3MTEwODYzOTl8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1501889088093-90b27410d97e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwzfHxQYXRod2F5c3xlbnwwfHx8fDE3MTEwODYzOTl8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1609126808708-17b84d5a61c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw0fHxQYXRod2F5c3xlbnwwfHx8fDE3MTEwODYzOTl8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1523861935384-19b3d8c8a86f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw1fHxQYXRod2F5c3xlbnwwfHx8fDE3MTEwODYzOTl8MA&ixlib=rb-4.0.3&q=80&w=1080"
    //       ],
    //       "layout": "grid-left",
    //       "text": "Description: Defining routes in a Next.js project is like mapping out pathways in a city. Routing helps navigate users through different pages and sections of the application, ensuring a seamless browsing experience.",
    //       "visibleSlots": 2,
    //       "title": "Routes",
    //       "theme": "Pathways"
    //     },
    //     {
    //       "id": "ad6b2ed1-64d3-49ce-a6b5-b2f2133183ef",
    //       "imageUrls": [
    //         "https://images.unsplash.com/photo-1539477192933-1a7dde04aa77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwxfHxCdWlsZGluZyUyMEJsb2Nrc3xlbnwwfHx8fDE3MTEwODY0MDB8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1638802538115-041e14d28d6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwyfHxCdWlsZGluZyUyMEJsb2Nrc3xlbnwwfHx8fDE3MTEwODY0MDB8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1560961911-ba7ef651a56c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwzfHxCdWlsZGluZyUyMEJsb2Nrc3xlbnwwfHx8fDE3MTEwODY0MDB8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1565626424178-c699f6601afd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw0fHxCdWlsZGluZyUyMEJsb2Nrc3xlbnwwfHx8fDE3MTEwODY0MDB8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1558907353-ceb54f3882ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw1fHxCdWlsZGluZyUyMEJsb2Nrc3xlbnwwfHx8fDE3MTEwODY0MDB8MA&ixlib=rb-4.0.3&q=80&w=1080"
    //       ],
    //       "layout": "grid-right",
    //       "text": "Description: Components in Next.js act as the building blocks of the application, similar to how bricks come together to construct a building. Reusable, modular components enhance code reusability, maintainability, and scalability.",
    //       "visibleSlots": 5,
    //       "title": "Components",
    //       "theme": "Building Blocks"
    //     },
    //     {
    //       "id": "5401bb48-3685-43ed-a679-50add839214d",
    //       "imageUrls": [
    //         "https://images.unsplash.com/photo-1614631446501-abcf76949eca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwxfHxXYXJkcm9iZXxlbnwwfHx8fDE3MTEwODY0MDB8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1558997519-83ea9252edf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwyfHxXYXJkcm9iZXxlbnwwfHx8fDE3MTEwODY0MDB8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwzfHxXYXJkcm9iZXxlbnwwfHx8fDE3MTEwODY0MDB8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1611048268330-53de574cae3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw0fHxXYXJkcm9iZXxlbnwwfHx8fDE3MTEwODY0MDB8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw1fHxXYXJkcm9iZXxlbnwwfHx8fDE3MTEwODY0MDB8MA&ixlib=rb-4.0.3&q=80&w=1080"
    //       ],
    //       "layout": "horizontal-bars",
    //       "text": "Description: Styling a Next.js project is like dressing it up with a unique wardrobe. Using CSS frameworks, preprocessors, or styled-components adds visual appeal and enhances the user interface design.",
    //       "visibleSlots": 5,
    //       "title": "Styling",
    //       "theme": "Wardrobe"
    //     },
    //     {
    //       "id": "e29fbf4a-6545-433f-99ce-e31b4f13a1dd",
    //       "imageUrls": [
    //         "https://images.unsplash.com/photo-1590337363833-86fe08393e42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwxfHxDZW50cmFsJTIwTmVydm91cyUyMFN5c3RlbXxlbnwwfHx8fDE3MTEwODY0MDF8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1595062783262-463da1894ede?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwyfHxDZW50cmFsJTIwTmVydm91cyUyMFN5c3RlbXxlbnwwfHx8fDE3MTEwODY0MDF8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1605859440670-0c32c5d73a6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwzfHxDZW50cmFsJTIwTmVydm91cyUyMFN5c3RlbXxlbnwwfHx8fDE3MTEwODY0MDF8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1637622418384-3f2b48dff52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw0fHxDZW50cmFsJTIwTmVydm91cyUyMFN5c3RlbXxlbnwwfHx8fDE3MTEwODY0MDF8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1597444192391-99ae4ab4f7d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw1fHxDZW50cmFsJTIwTmVydm91cyUyMFN5c3RlbXxlbnwwfHx8fDE3MTEwODY0MDF8MA&ixlib=rb-4.0.3&q=80&w=1080"
    //       ],
    //       "layout": "grid-left",
    //       "text": "Description: State management in Next.js serves as the central nervous system of the application, coordinating data flow and interactions between components. Implementing tools like Redux or Context API helps maintain a consistent state across the application.",
    //       "visibleSlots": 3,
    //       "title": "State Management",
    //       "theme": "Central Nervous System"
    //     },
    //     {
    //       "id": "1f558714-68fd-4d78-8337-9883680ae582",
    //       "imageUrls": [
    //         "https://images.unsplash.com/photo-1537151377170-9c19a791bbea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwxfHxDb25uZWN0b3JzfGVufDB8fHx8MTcxMTA4NjQwMXww&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1593619797213-5533e27e8694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwyfHxDb25uZWN0b3JzfGVufDB8fHx8MTcxMTA4NjQwMXww&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1631378961385-21bee7eb41ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwzfHxDb25uZWN0b3JzfGVufDB8fHx8MTcxMTA4NjQwMXww&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1608163483020-537b04aed43b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw0fHxDb25uZWN0b3JzfGVufDB8fHx8MTcxMTA4NjQwMXww&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1531492643958-bf0c4c4c441a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw1fHxDb25uZWN0b3JzfGVufDB8fHx8MTcxMTA4NjQwMXww&ixlib=rb-4.0.3&q=80&w=1080"
    //       ],
    //       "layout": "horizontal-bars",
    //       "text": "Description: Integrating APIs into a Next.js project is like fitting connectors to establish communication with external services. Fetching data from APIs enables dynamic content, real-time updates, and interactive features in the application.",
    //       "visibleSlots": 2,
    //       "title": "APIs",
    //       "theme": "Connectors"
    //     },
    //     {
    //       "id": "4e4fa89a-5be8-4be3-8ad4-a50ea16b1dbc",
    //       "imageUrls": [
    //         "https://images.unsplash.com/photo-1611656399028-82fbbff76693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwxfHxGaW5lLVR1bmluZ3xlbnwwfHx8fDE3MTEwODY0MDJ8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1472312656035-eeef4726de6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwyfHxGaW5lLVR1bmluZ3xlbnwwfHx8fDE3MTEwODY0MDJ8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1530538604540-de0436821dc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwzfHxGaW5lLVR1bmluZ3xlbnwwfHx8fDE3MTEwODY0MDJ8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1649744902035-96f20efc52e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw0fHxGaW5lLVR1bmluZ3xlbnwwfHx8fDE3MTEwODY0MDJ8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1616783943928-32f4e1e16147?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw1fHxGaW5lLVR1bmluZ3xlbnwwfHx8fDE3MTEwODY0MDJ8MA&ixlib=rb-4.0.3&q=80&w=1080"
    //       ],
    //       "layout": "horizontal-bars",
    //       "text": "Description: Optimizing a Next.js project involves fine-tuning performance, enhancing user experience, and improving loading times. Techniques like code splitting, lazy loading, and image optimization help streamline the application.",
    //       "visibleSlots": 2,
    //       "title": "Optimization",
    //       "theme": "Fine-Tuning"
    //     },
    //     {
    //       "id": "b5d398b7-4a05-4e48-9441-d993f616eb6d",
    //       "imageUrls": [
    //         "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwxfHxRdWFsaXR5JTIwQ29udHJvbHxlbnwwfHx8fDE3MTEwODY0MDJ8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1599583863916-e06c29087f51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwyfHxRdWFsaXR5JTIwQ29udHJvbHxlbnwwfHx8fDE3MTEwODY0MDJ8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1567613747256-9f97205d23d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwzfHxRdWFsaXR5JTIwQ29udHJvbHxlbnwwfHx8fDE3MTEwODY0MDJ8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1624957485560-47747511b32f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw0fHxRdWFsaXR5JTIwQ29udHJvbHxlbnwwfHx8fDE3MTEwODY0MDJ8MA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1590172205940-5b6eedf7ec82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw1fHxRdWFsaXR5JTIwQ29udHJvbHxlbnwwfHx8fDE3MTEwODY0MDJ8MA&ixlib=rb-4.0.3&q=80&w=1080"
    //       ],
    //       "layout": "grid-left",
    //       "text": "Description: Testing a Next.js project ensures quality control and identifies potential bugs or issues before deployment. Conducting unit tests, integration tests, and end-to-end tests helps maintain the reliability and functionality of the application.",
    //       "visibleSlots": 1,
    //       "title": "Testing",
    //       "theme": "Quality Control"
    //     },
    //     {
    //       "id": "22d90c23-a431-468a-b15b-d7e1f27506ea",
    //       "imageUrls": [
    //         "https://images.unsplash.com/photo-1517976384346-3136801d605d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwxfHxMYXVuY2glMjBQYWR8ZW58MHx8fHwxNzExMDg2NDAzfDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwyfHxMYXVuY2glMjBQYWR8ZW58MHx8fHwxNzExMDg2NDAzfDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1551871812-10ecc21ffa2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwzfHxMYXVuY2glMjBQYWR8ZW58MHx8fHwxNzExMDg2NDAzfDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1517976487492-5750f3195933?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw0fHxMYXVuY2glMjBQYWR8ZW58MHx8fHwxNzExMDg2NDAzfDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1516849677043-ef67c9557e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw1fHxMYXVuY2glMjBQYWR8ZW58MHx8fHwxNzExMDg2NDAzfDA&ixlib=rb-4.0.3&q=80&w=1080"
    //       ],
    //       "layout": "grid-right",
    //       "text": "Description: Deploying a Next.js project is like preparing for launch from a launch pad. Configuring servers, setting up environments, and deploying the application to production ensure it is accessible to users worldwide.",
    //       "visibleSlots": 3,
    //       "title": "Deployment",
    //       "theme": "Launch Pad"
    //     },
    //     {
    //       "id": "57b0cc90-bf27-4c49-b038-38247e5e3007",
    //       "imageUrls": [
    //         "https://images.unsplash.com/photo-1557597774-9d273605dfa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwxfHxTdXJ2ZWlsbGFuY2V8ZW58MHx8fHwxNzExMDg2NDAzfDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwyfHxTdXJ2ZWlsbGFuY2V8ZW58MHx8fHwxNzExMDg2NDAzfDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1590613607026-15c463e30ca5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwzfHxTdXJ2ZWlsbGFuY2V8ZW58MHx8fHwxNzExMDg2NDAzfDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw0fHxTdXJ2ZWlsbGFuY2V8ZW58MHx8fHwxNzExMDg2NDAzfDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1569087682520-45253cc2e0ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw1fHxTdXJ2ZWlsbGFuY2V8ZW58MHx8fHwxNzExMDg2NDAzfDA&ixlib=rb-4.0.3&q=80&w=1080"
    //       ],
    //       "layout": "grid-left",
    //       "text": "Description: Monitoring a Next.js project involves keeping a watchful eye on performance metrics, error logs, and user interactions. Monitoring tools help identify issues, track trends, and optimize the application for better performance.",
    //       "visibleSlots": 1,
    //       "title": "Monitoring",
    //       "theme": "Surveillance"
    //     },
    //     {
    //       "id": "78a524a8-31f7-4e78-9575-40f393039aab",
    //       "imageUrls": [
    //         "https://images.unsplash.com/photo-1591262184859-dd20d214b52a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwxfHxFdm9sdXRpb258ZW58MHx8fHwxNzExMDg2NDA0fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/flagged/photo-1552863473-6e5ffe5e052f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwyfHxFdm9sdXRpb258ZW58MHx8fHwxNzExMDg2NDA0fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1535231540604-72e8fbaf8cdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwzfHxFdm9sdXRpb258ZW58MHx8fHwxNzExMDg2NDA0fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1597053100221-fee3c1dcb6ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw0fHxFdm9sdXRpb258ZW58MHx8fHwxNzExMDg2NDA0fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1571990604349-d8b7d3c7e1da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw1fHxFdm9sdXRpb258ZW58MHx8fHwxNzExMDg2NDA0fDA&ixlib=rb-4.0.3&q=80&w=1080"
    //       ],
    //       "layout": "vertical-bars",
    //       "text": "Description: Updating a Next.js project is like facilitating its evolution over time. Implementing new features, fixing bugs, and adapting to changing requirements ensures the application remains relevant and competitive in the market.",
    //       "visibleSlots": 2,
    //       "title": "Updates",
    //       "theme": "Evolution"
    //     },
    //     {
    //       "id": "8895c2d8-bc72-4a40-850b-74afc7051535",
    //       "imageUrls": [
    //         "https://images.unsplash.com/photo-1529688374806-5637472b267b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwxfHxHdWlkZWJvb2t8ZW58MHx8fHwxNzExMDg2NDA0fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1594305452216-16210ca0cbb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwyfHxHdWlkZWJvb2t8ZW58MHx8fHwxNzExMDg2NDA0fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1570632715211-15e9af8a536d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwzfHxHdWlkZWJvb2t8ZW58MHx8fHwxNzExMDg2NDA0fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1562701447-e0b79b331bab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw0fHxHdWlkZWJvb2t8ZW58MHx8fHwxNzExMDg2NDA0fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1525465307453-c05aed978473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw1fHxHdWlkZWJvb2t8ZW58MHx8fHwxNzExMDg2NDA0fDA&ixlib=rb-4.0.3&q=80&w=1080"
    //       ],
    //       "layout": "grid-left",
    //       "text": "Description: Documenting a Next.js project is like creating a guidebook for developers to understand the codebase, architecture, and functionalities. Comprehensive documentation enhances collaboration, onboarding, and maintenance of the application.",
    //       "visibleSlots": 1,
    //       "title": "Documentation",
    //       "theme": "Guidebook"
    //     },
    //     {
    //       "id": "845933e1-8e6d-44f8-9144-edfc2b61936d",
    //       "imageUrls": [
    //         "https://images.unsplash.com/photo-1584257274862-42aa4f6e5f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwxfHxFY29zeXN0ZW18ZW58MHx8fHwxNzExMDg2NDA1fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1593259996642-a62989601967?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwyfHxFY29zeXN0ZW18ZW58MHx8fHwxNzExMDg2NDA1fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1570979872446-fb939e169d87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHwzfHxFY29zeXN0ZW18ZW58MHx8fHwxNzExMDg2NDA1fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1555629151-5738dff0ddd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw0fHxFY29zeXN0ZW18ZW58MHx8fHwxNzExMDg2NDA1fDA&ixlib=rb-4.0.3&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1595366586798-11e020008a2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzkxMzR8MHwxfHNlYXJjaHw1fHxFY29zeXN0ZW18ZW58MHx8fHwxNzExMDg2NDA1fDA&ixlib=rb-4.0.3&q=80&w=1080"
    //       ],
    //       "layout": "horizontal-bars",
    //       "text": "Description: Being part of the Next.js community is like contributing to a thriving ecosystem of developers, designers, and enthusiasts. Engaging with the community through forums, events, and open source projects fosters learning, collaboration, and innovation.",
    //       "visibleSlots": 3,
    //       "title": "Community",
    //       "theme": "Ecosystem"
    //     }
    //   ]
    // }
    {
      title: undefined,
      input: undefined,
      slides: undefined,
    }
  );

  const [inputFormWorking, setInputFormWorking] = useState(false);

  const handlePresentationActionFormSubmit: FormEventHandler<HTMLElementTagNameMap['form']> = async (e) => {
    e.preventDefault();
    const valuesRaw = new FormData(e.currentTarget);
    const { submitter } = e.nativeEvent as unknown as { submitter: HTMLButtonElement };
    if (submitter.name === 'action') {
      if (submitter.value.startsWith('download:')) {
        const [, mediaType] = submitter.value.split(':');
        const data = {
          title: valuesRaw.get('title'),
          input: valuesRaw.get('input'),
          slides: valuesRaw
            .getAll('slides')
            .reduce(
              (theSlides, slideJson) => {
                if (typeof slideJson === 'string') {
                  return [
                    ...theSlides,
                    JSON.parse(slideJson),
                  ];
                }

                return theSlides;
              },
              [] as Slide[]
            ),
        }

        const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: mediaType.trim() }));
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `mechakucha-download-${Date.now()}.json`;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return;
      }
      if (submitter.value.startsWith('save')) {
        setWorking('export');
        const appStateStr = JSON.stringify(appState);
        const response = await fetch(
          '/api/presentations',
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: appStateStr,
          }
        );

        if (response.status === 401) {
          window.localStorage.setItem('mechakucha-last-state', appStateStr);
          setWorking(undefined);
          await router.push({
            pathname: '/api/auth/providers/google',
          });
          return;
        }

        setWorking(undefined);
        window.alert('Slides exported!');
      }
    }
  };

  const makeSlides = (input: string): Partial<Slide>[] => {
    const theSlides: Partial<Slide>[] = input
      .split('\n')
      .filter((s) => s.trim().length > 0)
      .reduce(
        (previousSlides, line) => {
          if (line.startsWith('Part ')) {
            const [, partTitle] = line.split(':');
            const title = partTitle.trim();

            return [
              ...previousSlides,
              {
                id: window.crypto.randomUUID(),
                layout: SLIDE_LAYOUTS[Math.floor(Math.random() * SLIDE_LAYOUTS.length)],
                visibleSlots: Math.floor(Math.random() * (MAXIMUM_IMAGES + 1)),
                title,
                text: '',
              } as Partial<Slide>
            ];
          }

          if (line.startsWith('Theme:')) {
            const [, query] = line.split(':');
            const theme = query.trim();
            const lastSlide = previousSlides.at(-1);
            if (typeof lastSlide === 'undefined') {
              return previousSlides;
            }
            return [
              ...previousSlides.slice(0, -1),
              {
                ...lastSlide,
                theme,
              }
            ] as Slide[];
          }

          const lastSlide = previousSlides.at(-1);
          if (typeof lastSlide === 'undefined') {
            return previousSlides;
          }
          return [
            ...previousSlides.slice(0, -1),
            {
              ...lastSlide,
              text: `${lastSlide.text}\n\n${line.trim()}`.trim()
            }
          ];
        },
        [] as Partial<Slide>[]
      );

    const incompleteSlides = theSlides.filter((slide) => (
      typeof slide.title === 'undefined'
      || typeof slide.theme === 'undefined'
    ));

    if (incompleteSlides.length > 0) {
      throw new Error('Incomplete slides', {
        cause: incompleteSlides
      });
    }

    return theSlides;
  };

  const getSingleImage = async (slide: Slide, index: number) => {
    const r = await fetch(
      `/api/images/${appState.imageGenerator}/generate-single?index=${index}`,
      {
        method: 'POST',
        body: JSON.stringify(slide),
      },
    )
    if (!r.ok) {
      throw new Error('Error from Image Generator API.');
    }
    const rr = await r.json();
    return rr as ImageSlotContent;
  };

  const addSlideImages = async (slide: Partial<Slide>, imageGenerator: string): Promise<Slide> => {
    const r = await fetch(
      `/api/images/${imageGenerator}/generate`,
      {
        method: 'POST',
        body: JSON.stringify(slide),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
    if (!r.ok) {
      throw new Error('Error from Image Generator API.');
    }
    const rr = await r.json();
    return {
      ...slide,
      slots: rr
    } as Slide;
  };

  const addImages = async (slides: Partial<Slide>[], imageGenerator: string): Promise<Slide[]> => {
    const result = await Promise.allSettled(
      slides.map((slide) => addSlideImages(slide, imageGenerator))
    );

    return result.map((r, i) => {
      if (r.status === 'fulfilled') {
        return r.value ?? slides[i] as Slide;
      }

      return slides[i] as Slide;
    });
  };

  const handleInputFormReset: FormEventHandler<HTMLElementTagNameMap['form']> = async (e) => {
    e.preventDefault();
    const { input: _, ...etcQuery } = router.query;
    await router.replace({
      query: etcQuery
    });
  };

  const handleInputFormSubmit: FormEventHandler<HTMLElementTagNameMap['form']> = async (e) => {
    e.preventDefault();
    setInputFormWorking(true);
    const valuesRaw = new FormData(e.currentTarget);
    const title = valuesRaw.get('title') as string ?? '';
    const { submitter } = e.nativeEvent as unknown as { submitter: HTMLButtonElement };
    if (submitter.name === 'submit' && submitter.value === 'inspire-me') {
      const response = await fetch(
        '/api/contents/airops/generate',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
          }),
        }
      );
      const responseBody = await response.json();
      if (response.ok) {
        setFormKey(Date.now());
        setAppState((oldAppState) => ({
          ...oldAppState,
          title,
          input: responseBody,
        }));
      } else {
        window.alert(responseBody.message);
      }
      setInputFormWorking(false);
      return;
    }

    const input = valuesRaw.get('input') as string ?? '';
    const values = {
      title,
      input,
    };

    setSlideImageLoading([0, 1, 2, 3, 4]);
    let theSlides: Partial<Slide>[];
    try {
      theSlides = makeSlides(input);
    } catch (errRaw) {
      const err = errRaw as Error;
      // TODO better error handling!
      window.alert(err.message as string);
      return;
    }

    const resultSlides = await addImages(theSlides, valuesRaw.get('imageGenerator') as string);
    setAppState((oldAppState) => ({
      ...oldAppState,
      ...values,
      slides: resultSlides,
    }));

    const { input: _, ...etcQuery } = router.query;
    await router.replace({
      query: {
        ...etcQuery,
        slide: resultSlides[0].id,
      }
    });
    setInputFormWorking(false);
  };

  const handleUpdateCurrentSlide: ChangeEventHandler<
    HTMLElementTagNameMap['input']
    | HTMLElementTagNameMap['select']
    | HTMLElementTagNameMap['textarea']
  > = (e) => {
    if (typeof router.query.slide !== 'string') {
      return;
    }
    const slideId = router.query.slide;
    const name = e.currentTarget.name;
    const value = (
      e.currentTarget.tagName === 'INPUT' && e.currentTarget.type === 'number'
        ? (e.currentTarget as HTMLElementTagNameMap['input']).valueAsNumber
        : e.currentTarget.value
    );
    setAppState((oldAppState) => ({
      ...oldAppState,
      slides: oldAppState?.slides?.map((s) => (
        s.id === slideId
          ? {
            ...s,
            [name]: value
          }
          : s
      ))
    }));
  };

  const handleWindowDrop: DragEventHandler<HTMLElementTagNameMap['main']> = async (e) => {
    e.preventDefault();
    const [file] = Array.from(e.dataTransfer.files);
    if (typeof file === 'undefined') {
      return;
    }

    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.addEventListener('error', (e) => {
        reject(e);
      })

      fileReader.addEventListener('load', async (e) => {
        const result = (e.currentTarget as FileReader).result as string;
        const newAppState = JSON.parse(result);
        setAppState(newAppState);
        const { input: _, ...etcQuery } = router.query;
        await router.replace({
          query: {
            ...etcQuery,
            slide: newAppState.slides[0].id,
          }
        });
        params?.refresh?.();
        resolve();
      });

      fileReader.readAsText(file);
    });
  };

  const handleSlideDataAction: FormEventHandler<HTMLElementTagNameMap['form']> = async (e) => {
    e.preventDefault();
    const valuesRaw = new FormData(e.currentTarget);
    const id = valuesRaw.get('id') as string ?? '';
    const { submitter } = e.nativeEvent as unknown as { submitter: HTMLButtonElement };
    if (submitter.name === 'action' && submitter.value === 'regenerate') {
      const thisSlide = appState.slides?.find((s) => s.id === id);
      if (typeof thisSlide === 'undefined') {
        return;
      }
      setSlideImageLoading([0, 1, 2, 3, 4]);
      const slideWithNewImages = await addSlideImages(thisSlide);
      setAppState((oldAppState) => ({
        ...oldAppState,
        slides: oldAppState.slides?.map((oldSlide) => (
          oldSlide.id === slideWithNewImages.id
            ? slideWithNewImages
            : oldSlide
        ))
      }));
    }
  };

  const handleCurrentSlideImageLoaded: ReactEventHandler<HTMLElementTagNameMap['img']> = (e) => {
    const parent = e.currentTarget.parentElement;
    if (parent === null) {
      return;
    }
    const grandparent = parent.parentElement;
    if (grandparent === null) {
      return;
    }
    const siblings = Array.from(grandparent.children);
    const thisIndex = siblings.findIndex((el) => el === parent);
    setSlideImageLoading((oldSlideImageLoading) => oldSlideImageLoading.filter((s) => s !== thisIndex));
  };

  const handleCurrentSlideImageRegenerate: FormEventHandler<HTMLElementTagNameMap['form']> = async (e) => {
    e.preventDefault();
    const currentSlide = appState.slides?.find((s) => s.id === router.query.slide);
    if (typeof currentSlide === 'undefined') {
      return;
    }
    const parent = e.currentTarget.parentElement;
    if (parent === null) {
      return;
    }
    const grandparent = parent.parentElement;
    if (grandparent === null) {
      return;
    }
    const siblings = Array.from(grandparent.children);
    const thisIndex = siblings.findIndex((el) => el === parent);

    const { submitter } = e.nativeEvent as unknown as { submitter: HTMLButtonElement };
    if (submitter.name === 'action') {
      switch (submitter.value) {
        case 'regenerate': {
          setSlideImageLoading((oldSlideImageLoading) => [
            ...oldSlideImageLoading,
            thisIndex
          ]);
          const image = await getSingleImage(currentSlide, thisIndex);
          const newSlide: Slide = {
            ...currentSlide,
            slots: [
              ...currentSlide.slots.slice(0, thisIndex),
              image,
              ...currentSlide.slots.slice(thisIndex)
            ] as SlotCollection,
          };
          setAppState((oldAppState) => ({
            ...oldAppState,
            slides: oldAppState.slides?.map((oldSlide) => (
              oldSlide.id === newSlide.id
                ? newSlide
                : oldSlide
            ))
          }));
          return;
        }
        default:
          break;
      }
    }
  }

  useEffect(() => {
    if (
      (typeof appState.title === 'undefined' || typeof appState.input === 'undefined')
    ) {
      const lastStateStr = window.localStorage.getItem('mechakucha-last-state');
      let lastState = null;
      try {
        if (lastStateStr !== null) {
          lastState = JSON.parse(lastStateStr);
        }
      } catch {
        lastState = null;
      }
      if (lastState === null || typeof router.query.input !== 'string') {
        void router.replace({
          query: {
            input: 'true'
          }
        });
        return;
      }
      setAppState(lastState as AppState);
      window.localStorage.removeItem('mechakucha-last-state');
    }
  }, []);

  return {
    handlePresentationActionFormSubmit,
    handleInputFormReset,
    handleInputFormSubmit,
    handleUpdateCurrentSlide,
    handleWindowDrop,
    inputFormWorking,
    handleSlideDataAction,
    handleCurrentSlideImageLoaded,
    handleCurrentSlideImageRegenerate,
    slideImageLoading,
    appState,
    formKey,
    working,
  };
};
