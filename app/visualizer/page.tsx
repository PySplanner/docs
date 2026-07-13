"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { WaypointsIcon, CodeIcon, ArrowRightIcon, XIcon, GripVerticalIcon, PlusIcon } from "lucide-react"
import { useState } from "react"
import { ReactSortable } from "react-sortablejs";
import { Button } from "@/components/ui/button"
import { useScrollbarDetection } from "@/hooks/use-scrollbar-detection"

interface PathPoint {
    id: string;
    name: string;
    x: number;
    y: number;
    heading: number;
}

interface ActionPoint {
    id: string;
    name: string;
    t: number;
    action: string;
}

interface Splan {
    id: string;
    name: string;
    pathPoints: PathPoint[];
    actionPoints: ActionPoint[];
}

export default function Visualizer() {
    const { containerRef, hasHorizontalScrollbar, scrollbarThickness } = useScrollbarDetection();
    const [splans, setSplans] = useState<Splan[]>([
        {
            id: "0",
            name: "Splan 1",
            pathPoints: [
              { id: "0", name: "Point 1", x: 0, y: 0, heading: 0 }, 
              { id: "1", name: "Point 67", x: 20, y: 67, heading: 45 }
            ],
            actionPoints: [
              { id: "0", name: "Smth smth action", t: 0.2, action: "some_function" },
              { id: "1", name: "Raise Arm", t: 0.8, action: "raise_arm" }
            ]
        },
        {
            id: "1",
            name: "Splan 2",
            pathPoints: [
              { id: "0", name: "Point 1234", x: 0, y: 0, heading: 0 }, 
              { id: "2", name: "Point 4321", x: 67, y: 15, heading: 90 }
            ],
            actionPoints: [
              { id: "0", name: "Action 67", t: 0.2, action: "some_function" },
              { id: "1", name: "Lower Arm", t: 0.8, action: "lower_arm" }
            ]
        },
        {
            id: "3",
            name: "Splan 3",
            pathPoints: [
              { id: "0", name: "Point 1234", x: 0, y: 0, heading: 0 }, 
              { id: "1", name: "Point 4321", x: 67, y: 15, heading: 90 }
            ],
            actionPoints: [
              { id: "0", name: "Action 67", t: 0.2, action: "some_function" },
              { id: "1", name: "Lower Arm", t: 0.8, action: "lower_arm" }
            ]
        }
    ]);
    
    const [selectedSplanId, setSelectedSplanId] = useState("0"); // TODO: Make this -1 when hardcodes are removed
    const [selectedPointId, setSelectedPointId] = useState("-1");
    const [selectedActionId, setSelectedActionId] = useState("-1");
    const [hoveredPointId, setHoveredPointId] = useState("-1");
    const [hoveredActionId, setHoveredActionId] = useState("-1");
    
    const handleSetPathPoints = (newPathPoints: PathPoint[]) => {
        if (selectedSplanId === "-1") return;
        
        setSplans(prevSplans => {
            const updatedSplans = [...prevSplans];
            const splanIndex = getSelectedSplanIndex();
            updatedSplans[splanIndex] = {
                ...updatedSplans[splanIndex],
                pathPoints: newPathPoints
            };
            return updatedSplans;
        });
    };

    const handleSetActionPoints = (newActionPoints: ActionPoint[]) => {
        if (selectedSplanId === "-1") return;

        setSplans(prevSplans => {
            const updatedSplans = [...prevSplans];
            const splanIndex = getSelectedSplanIndex();
            updatedSplans[splanIndex] = {
                ...updatedSplans[splanIndex],
                actionPoints: newActionPoints
            };
            return updatedSplans;
        });
    }

    const getSelectedSplanIndex = () => {
        return splans.findIndex((splan) => splan.id === selectedSplanId);
    }

    const deleteSplan = (splanId: string) => {
        const newSplans = splans.filter(splan => splan.id !== splanId);
        if (selectedSplanId === splanId) {
            setSelectedSplanId(newSplans.length > 0 ? newSplans[0].id : "-1");
        }
        setSplans(newSplans);
    };

    const createSplan = () => {
        const newSplan: Splan = {
            id: (splans.length + 1).toString(),
            name: `Splan ${splans.length + 1}`,
            pathPoints: [],
            actionPoints: []
        };
        setSplans([...splans, newSplan]);
        setSelectedSplanId(newSplan.id);
    }

    return (
        <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize="400px" minSize="300px" maxSize="600px" collapsible>
                <Tabs defaultValue="points">
                    <TabsList variant="line" className="w-full">
                        <TabsTrigger value="points">
                            <WaypointsIcon /> Splan Info
                        </TabsTrigger>
                        <TabsTrigger value="code">
                            <CodeIcon /> Code
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="points">
                        <Accordion type="multiple" className="px-4">
                            <AccordionItem value="points">
                                <AccordionTrigger>Points</AccordionTrigger>
                                <AccordionContent>
                                    <ReactSortable 
                                        tag="ul" id="points-list" list={splans[getSelectedSplanIndex()]?.pathPoints || []}
                                        setList={handleSetPathPoints} animation={200} handle=".handle"
                                    >
                                        {splans[getSelectedSplanIndex()]?.pathPoints.map((point) => (
                                            <li key={point.id} className="flex flex-row items-center mb-2 last:mb-0">
                                                <GripVerticalIcon 
                                                    className="handle mr-2 text-muted-foreground cursor-grab active:cursor-grabbing" 
                                                />
                                                <Button variant="outline" size="lg"
                                                    className="flex flex-1 justify-start hover:text-primary"
                                                    onClick={() => setSelectedPointId(point.id)}
                                                    onMouseEnter={() => setHoveredPointId(point.id)}
                                                    onMouseLeave={() => setHoveredPointId("-1")}
                                                >
                                                    <span>{point.name}</span>
                                                    <span className="ml-1 text-muted-foreground">
                                                      ({point.x}, {point.y}, {point.heading})
                                                    </span>
                                                    <ArrowRightIcon className="ml-auto" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ReactSortable>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="actions">
                                <AccordionTrigger>Actions</AccordionTrigger>
                                <AccordionContent>
                                    <ReactSortable 
                                        tag="ul" id="actions-list" list={splans[getSelectedSplanIndex()]?.actionPoints || []}
                                        setList={handleSetActionPoints} animation={200} handle=".handle"
                                    >
                                        {splans[getSelectedSplanIndex()]?.actionPoints.map((point) => (
                                            <li key={point.id} className="flex flex-row items-center mb-2 last:mb-0">
                                                <GripVerticalIcon 
                                                    className="handle mr-2 text-muted-foreground cursor-grab active:cursor-grabbing" 
                                                />
                                                <Button variant="outline" size="lg" 
                                                    className="flex flex-1 justify-start hover:text-primary"
                                                    onClick={() => setSelectedActionId(point.id)}
                                                    onMouseEnter={() => setHoveredActionId(point.id)} 
                                                    onMouseLeave={() => setHoveredActionId("-1")}
                                                >
                                                    <span>{point.name}</span>
                                                    <span className="ml-1 text-muted-foreground">{point.t}</span>
                                                    <ArrowRightIcon className="ml-auto" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ReactSortable>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </TabsContent>
                </Tabs>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="flex flex-col overflow-hidden">
                <div className="flex w-full p-2 border-b items-center overflow-x-auto overflow-y-hidden"
                    ref={containerRef} style={{ height: hasHorizontalScrollbar ? `calc(64px + ${scrollbarThickness}px)` : '64px' }}
                >
                    <ReactSortable tag="ul" id="splans-list" list={splans} setList={setSplans} animation={200}
                        className="flex flex-row gap-2 items-center" handle=".handle"
                    >
                      {splans.map((splan) => (
                          <li key={splan.id} className="flex flex-row shrink-0">
                              <Button className="handle rounded-r-none border-r-0" variant="outline" size="lg">
                                <GripVerticalIcon 
                                    className="text-muted-foreground cursor-grab active:cursor-grabbing" 
                                />
                              </Button>
                              <Button variant="outline" size="lg" 
                                  className="flex flex-row items-center min-w-24 justify-start rounded-none hover:text-primary"
                                  onClick={() => setSelectedSplanId(splan.id)}
                              >
                                  <span>{splan.name}</span>
                              </Button>
                              <Button variant="outline" size="lg" className="rounded-l-none border-l-0"
                                  onClick={() => deleteSplan(splan.id)}
                              >
                                <XIcon className="ml-auto" />
                              </Button>
                          </li>
                      ))}
                  </ReactSortable>
                  <Button variant="default" size="lg" className="shrink-0 ml-2 text-black"
                      onClick={createSplan}
                  >
                    <PlusIcon className="size-6" />
                  </Button>
                </div>
                <div className="flex flex-1">
                    stuff
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}