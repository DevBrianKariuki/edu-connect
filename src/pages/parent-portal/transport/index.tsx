
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Bus, Route } from "lucide-react";

const TransportTrackingPage = () => {
    const [selectedBus, setSelectedBus] = useState<string>("");

    return (
        <div className="p-6 space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2">
                <Bus className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Transport Tracking</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Bus Route
                                </p>
                                <p className="text-2xl font-bold">Route A</p>
                            </div>
                            <Route className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Bus Number
                                </p>
                                <p className="text-2xl font-bold">KCB 123X</p>
                            </div>
                            <Bus className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Next Stop
                                </p>
                                <p className="text-2xl font-bold">5 mins</p>
                            </div>
                            <MapPin className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Live Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[600px] rounded-lg border bg-card p-4">
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            Google Maps integration will be implemented here to show real-time location of the bus
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Transport Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Pickup Point</Label>
                            <Input value="Westlands Mall" readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label>Drop-off Point</Label>
                            <Input value="School" readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label>Pickup Time</Label>
                            <Input value="7:00 AM" readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label>Drop-off Time</Label>
                            <Input value="4:00 PM" readOnly />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TransportTrackingPage;
