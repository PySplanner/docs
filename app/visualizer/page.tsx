"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { WaypointsIcon, CodeIcon, ArrowRightIcon, XIcon, GripVerticalIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useState, useRef, useCallback, useEffect } from "react"
import { ReactSortable } from "react-sortablejs";
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

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

    const wrapRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

    const updateArrows = useCallback(() => {
        if (!trackRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const needsScroll = maxScroll > 2;

        setShowLeft(needsScroll && scrollLeft > 2);
        setShowRight(needsScroll && scrollLeft < maxScroll - 2);
    }, []);

    useEffect(() => {
        const wrap = wrapRef.current;
        const track = trackRef.current;
        if (!wrap || !track) return;

        const handleWheel = (e: WheelEvent) => {
            if (track.scrollWidth > track.clientWidth) {
                e.preventDefault();
                track.scrollLeft += (e.deltaY !== 0 ? e.deltaY : e.deltaX);
                updateArrows();
            }
        };

        wrap.addEventListener('wheel', handleWheel, { passive: false }); // passive: false to allow preventDefault
        track.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);

        setTimeout(updateArrows, 50);

        return () => {
            wrap.removeEventListener('wheel', handleWheel);
            track.removeEventListener('scroll', updateArrows);
            window.removeEventListener('resize', updateArrows);
        };
    }, [updateArrows, splans.length]); 

    const scrollLeft = () => trackRef.current?.scrollBy({ left: -160, behavior: 'smooth' });
    const scrollRight = () => trackRef.current?.scrollBy({ left: 160, behavior: 'smooth' });
    
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
        setTimeout(updateArrows, 10);
    };

    const createSplan = () => {
        if (splans.length >= 50) {
            toast.error("Maximum number of splans reached (50).");
            return;
        }

        const newSplan: Splan = {
            id: (Date.now()).toString(),
            name: `Splan ${splans.length + 1}`,
            pathPoints: [], actionPoints: []
        };
        setSplans([...splans, newSplan]);
        setSelectedSplanId(newSplan.id);
        
        // Scroll to end when new tab is created
        setTimeout(() => {
            if (trackRef.current) {
                trackRef.current.scrollLeft = trackRef.current.scrollWidth;
                updateArrows();
            }
        }, 10);
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
                <div className="relative flex items-center px-2 py-3 border-b" ref={wrapRef}>
                    
                    <div className={`absolute left-0 top-0 bottom-0 w-14 bg-linear-to-r from-background to-transparent pointer-events-none z-10 transition-opacity duration-200 ${showLeft ? 'opacity-100' : 'opacity-0'}`}></div>
                    <button onClick={scrollLeft} className={`absolute left-0.5 z-20 bg-transparent text-primary w-7 h-7 flex items-center justify-center transition-opacity duration-200 ${showLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                        <ChevronLeftIcon size={16} strokeWidth={2.5} />
                    </button>

                    <div className="flex gap-2.5 overflow-x-auto scroll-smooth flex-1 px-1 scrollbar-hide" ref={trackRef} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <ReactSortable tag="div" id="splans-list" list={splans} setList={setSplans} animation={200} handle=".handle" className="flex flex-row gap-2.5 items-center">
                            {splans.map((splan) => (
                                <div key={splan.id} onClick={() => setSelectedSplanId(splan.id)} className={`flex items-center gap-2 shrink-0 bg-[#1c1c1c] border ${selectedSplanId === splan.id ? 'border-[#e8c547] text-[#e8c547]' : 'border-[#333] text-[#eee]'} rounded-lg px-3 h-9 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors`}>
                                    <GripVerticalIcon className="handle text-[#666] w-3.5 h-3.5 cursor-grab active:cursor-grabbing" />
                                    <span>{splan.name}</span>
                                    <XIcon onClick={(e) => { e.stopPropagation(); deleteSplan(splan.id); }} className="text-[#888] hover:text-white w-3.5 h-3.5 cursor-pointer transition-colors" />
                                </div>
                            ))}
                        </ReactSortable>
                    </div>

                    <div className={`absolute right-10 top-0 bottom-0 w-14 bg-linear-to-l from-background to-transparent pointer-events-none z-10 transition-opacity duration-200 ${showRight ? 'opacity-100' : 'opacity-0'}`}></div>
                    <button onClick={scrollRight} className={`absolute right-10.5 z-20 bg-transparent text-primary w-7 h-7 flex items-center justify-center transition-opacity duration-200 ${showRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                        <ChevronRightIcon size={16} strokeWidth={2.5} />
                    </button>

                    <button onClick={createSplan} className="relative z-20 shrink-0 w-9 h-9 rounded-lg text-black bg-primary hover:bg-primary/80 flex items-center justify-center ml-2 transition-colors">
                        <PlusIcon size={18} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="flex flex-1 p-4">
                    stuff
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}